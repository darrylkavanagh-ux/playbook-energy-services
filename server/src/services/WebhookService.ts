/**
 * WEBHOOK OUTBOUND SERVICE — P1
 * =============================================================================
 * Delivers Playbook Trading events to registered external endpoints.
 *
 * Supported event types:
 *   SIGNAL_GENERATED   — New trading signal created
 *   SIGNAL_HITL_APPROVED — Trader approved signal via HITL
 *   TRADE_OPENED       — Phantom trade opened
 *   TRADE_CLOSED       — Phantom trade closed with P&L
 *   ACCURACY_MILESTONE — Platform hits accuracy threshold
 *   ORACLE_SCORE       — Oracle score computed for a symbol
 *
 * Delivery targets:
 *   SLACK   — Slack Incoming Webhooks (formatted with attachments)
 *   TEAMS   — Microsoft Teams (Adaptive Cards)
 *   DISCORD — Discord Webhooks (embeds)
 *   CUSTOM  — Raw JSON POST to any HTTPS endpoint
 *
 * Reliability:
 *   - 3 retry attempts with exponential backoff (1s, 2s, 4s)
 *   - Timeout: 10 seconds per attempt
 *   - HMAC-SHA256 signature on all deliveries (X-Playbook-Signature)
 *   - Fire-and-forget (non-blocking) — failures logged but don't block API
 *
 * Setup:
 *   1. Register a webhook: POST /api/trading/webhooks (user_id, url, type, events)
 *   2. On each event, WebhookService.fire(event, data) is called
 *   3. Payload is formatted per endpoint type and delivered
 *
 * Security:
 *   - Each webhook has a secret (stored hashed in Supabase)
 *   - X-Playbook-Signature: sha256=HMAC(secret, body) header on each delivery
 *   - Receiving server can verify signature to confirm authenticity
 */

import crypto from 'crypto';
import supabaseService, { isSupabaseEnabled } from './SupabaseService.js';
import type { DBWebhookEndpoint } from './SupabaseService.js';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type WebhookEventType =
  | 'SIGNAL_GENERATED'
  | 'SIGNAL_HITL_APPROVED'
  | 'SIGNAL_HITL_REJECTED'
  | 'TRADE_OPENED'
  | 'TRADE_CLOSED'
  | 'ACCURACY_MILESTONE'
  | 'ORACLE_SCORE'
  | 'CALIBRATION_UPDATED'
  | 'CB_NLP_SCORED';

export interface WebhookPayload {
  event:      WebhookEventType;
  data:       Record<string, unknown>;
  timestamp:  string;
  platform:   string;
  version:    string;
}

interface DeliveryResult {
  endpoint_id: string;
  url:         string;
  success:     boolean;
  status_code?: number;
  attempts:    number;
  error?:      string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLACK FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

function formatSlack(event: WebhookEventType, data: Record<string, unknown>): object {
  const emoji: Record<WebhookEventType, string> = {
    SIGNAL_GENERATED:       '📊',
    SIGNAL_HITL_APPROVED:   '✅',
    SIGNAL_HITL_REJECTED:   '❌',
    TRADE_OPENED:           '📈',
    TRADE_CLOSED:           '💰',
    ACCURACY_MILESTONE:     '🎯',
    ORACLE_SCORE:           '🔮',
    CALIBRATION_UPDATED:    '⚙️',
    CB_NLP_SCORED:          '🏦',
  };

  const title = event.replace(/_/g, ' ');

  if (event === 'SIGNAL_GENERATED') {
    return {
      attachments: [{
        color:    (data.action === 'BUY') ? '#00C896' : (data.action === 'SELL') ? '#FF3333' : '#888888',
        title:    `${emoji[event]} Playbook Trading — ${title}`,
        fields: [
          { title: 'Symbol',      value: String(data.symbol || ''),       short: true },
          { title: 'Action',      value: String(data.action || ''),       short: true },
          { title: 'Confidence',  value: `${data.confidence_pct || ''}%`, short: true },
          { title: 'Calibrated',  value: `${data.calibrated_pct || ''}%`, short: true },
          { title: 'Entry Price', value: String(data.entry_price || ''),  short: true },
          { title: 'Signal ID',   value: String(data.signal_id || ''),    short: true },
        ],
        footer: 'Playbook Trading — Orb AI Universe',
        ts:     Math.floor(Date.now() / 1000),
      }],
    };
  }

  if (event === 'TRADE_CLOSED') {
    const pnl = Number(data.pnl_usd || 0);
    return {
      attachments: [{
        color:  pnl >= 0 ? '#00C896' : '#FF3333',
        title:  `${emoji[event]} Playbook Trading — Trade Closed`,
        fields: [
          { title: 'Symbol',  value: String(data.symbol || ''),              short: true },
          { title: 'P&L',     value: `$${pnl.toFixed(2)}`,                   short: true },
          { title: 'Status',  value: String(data.status  || ''),             short: true },
          { title: 'Reason',  value: String(data.close_reason || ''),        short: true },
        ],
        footer: 'Playbook Trading — Paper Account',
        ts:     Math.floor(Date.now() / 1000),
      }],
    };
  }

  // Generic
  return {
    text: `${emoji[event]} *Playbook Trading — ${title}*`,
    attachments: [{
      fields: Object.entries(data)
        .filter(([k]) => !k.startsWith('_'))
        .slice(0, 6)
        .map(([k, v]) => ({ title: k, value: String(v), short: true })),
      footer: 'Playbook Trading',
      ts:     Math.floor(Date.now() / 1000),
    }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAMS FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

function formatTeams(event: WebhookEventType, data: Record<string, unknown>): object {
  const title = `Playbook Trading — ${event.replace(/_/g, ' ')}`;
  const facts = Object.entries(data)
    .filter(([k]) => !k.startsWith('_'))
    .slice(0, 8)
    .map(([name, value]) => ({ name, value: String(value) }));

  return {
    '@type':    'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: '00C896',
    summary:    title,
    sections: [{
      activityTitle:    title,
      activitySubtitle: new Date().toISOString(),
      facts,
      markdown:         true,
    }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCORD FORMATTER
// ─────────────────────────────────────────────────────────────────────────────

function formatDiscord(event: WebhookEventType, data: Record<string, unknown>): object {
  const color = event.includes('CLOSED') && Number(data.pnl_usd || 0) >= 0 ? 0x00C896
    : event.includes('CLOSED') ? 0xFF3333
    : event === 'SIGNAL_GENERATED' && data.action === 'BUY' ? 0x00C896
    : 0x5865F2;

  return {
    embeds: [{
      title:       `Playbook Trading — ${event.replace(/_/g, ' ')}`,
      color,
      timestamp:   new Date().toISOString(),
      fields:      Object.entries(data)
        .filter(([k]) => !k.startsWith('_'))
        .slice(0, 10)
        .map(([name, value]) => ({ name, value: String(value), inline: true })),
      footer:      { text: 'Playbook Trading — Orb AI Universe' },
    }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class WebhookService {

  private inMemoryEndpoints: DBWebhookEndpoint[] = [];

  // ── Register an endpoint (in-memory, until Supabase is configured) ────────

  registerEndpoint(endpoint: Omit<DBWebhookEndpoint, 'id' | 'fire_count' | 'created_at'>): string {
    const id = crypto.randomBytes(8).toString('hex');
    this.inMemoryEndpoints.push({
      ...endpoint,
      id,
      fire_count: 0,
      created_at: new Date().toISOString(),
    });
    return id;
  }

  // ── Fire an event to all matching webhooks ────────────────────────────────

  async fire(event: WebhookEventType, data: Record<string, unknown>): Promise<DeliveryResult[]> {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp:  new Date().toISOString(),
      platform:   'Playbook Trading — Orb AI Universe',
      version:    '3.0.0',
    };

    // Get endpoints from Supabase or in-memory fallback
    let endpoints: DBWebhookEndpoint[] = [...this.inMemoryEndpoints];
    if (isSupabaseEnabled()) {
      const { data: rows } = await supabaseService.getActiveWebhooks([event]);
      if (rows) endpoints = rows;
    }

    const matching = endpoints.filter(ep =>
      ep.active && (ep.events.length === 0 || ep.events.includes(event))
    );

    if (matching.length === 0) return [];

    const results = await Promise.all(matching.map(ep => this.deliver(ep, payload)));
    return results;
  }

  // ── Deliver to a single endpoint with retries ─────────────────────────────

  private async deliver(
    endpoint: DBWebhookEndpoint,
    payload: WebhookPayload,
  ): Promise<DeliveryResult> {
    let body: string;
    let formatted: object;

    // Format based on endpoint type
    switch (endpoint.type) {
      case 'SLACK':   formatted = formatSlack(payload.event, payload.data);   break;
      case 'TEAMS':   formatted = formatTeams(payload.event, payload.data);   break;
      case 'DISCORD': formatted = formatDiscord(payload.event, payload.data); break;
      default:        formatted = payload;
    }

    body = JSON.stringify(formatted);

    // Compute HMAC signature
    const secret    = endpoint.secret_hash || 'playbook-trading';
    const signature = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;

    const maxAttempts = 3;
    let lastError = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(endpoint.url, {
          method:  'POST',
          headers: {
            'Content-Type':         'application/json',
            'X-Playbook-Signature': signature,
            'X-Playbook-Event':     payload.event,
            'X-Playbook-Version':   '3.0.0',
            'User-Agent':           'Playbook-Trading-Webhook/3.0',
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          if (isSupabaseEnabled() && endpoint.id) {
            await supabaseService.recordWebhookFired(endpoint.id);
          }
          return { endpoint_id: endpoint.id || '', url: endpoint.url, success: true, status_code: response.status, attempts: attempt };
        }

        lastError = `HTTP ${response.status}`;

      } catch (err: any) {
        lastError = err.message || 'Unknown error';
        if (attempt < maxAttempts) {
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        }
      }
    }

    return {
      endpoint_id: endpoint.id || '',
      url:         endpoint.url,
      success:     false,
      attempts:    maxAttempts,
      error:       lastError,
    };
  }

  // ── Quick fire to a specific URL (one-off) ────────────────────────────────

  async fireToUrl(
    url:   string,
    type:  DBWebhookEndpoint['type'],
    event: WebhookEventType,
    data:  Record<string, unknown>,
  ): Promise<DeliveryResult> {
    const endpoint: DBWebhookEndpoint = {
      id:          'one-off',
      user_id:     'system',
      label:       'One-off delivery',
      url,
      type,
      events:      [event],
      active:      true,
      fire_count:  0,
    };
    return this.deliver(endpoint, { event, data, timestamp: new Date().toISOString(), platform: 'Playbook Trading', version: '3.0.0' });
  }

  getRegisteredEndpoints(): DBWebhookEndpoint[] {
    return this.inMemoryEndpoints;
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const webhookService = new WebhookService();
export default webhookService;
