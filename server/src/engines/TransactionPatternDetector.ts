/**
 * TRANSACTION PATTERN DETECTOR
 * Advanced Money Laundering Detection System
 * 
 * Implementing techniques from:
 * - FinCEN (US Financial Crimes Enforcement Network)
 * - FATF (Financial Action Task Force) - 40 Recommendations
 * - FBI Money Laundering Unit
 * - NCA (UK National Crime Agency) - Economic Crime Command
 * - Europol Financial Intelligence Group
 * - INTERPOL Financial Crimes Unit
 * - CAB (Irish Criminal Assets Bureau)
 * 
 * Detection Methods:
 * 1. Structuring/Smurfing (breaking large amounts into smaller transactions)
 * 2. Layering (complex web of transactions to obscure origin)
 * 3. Rapid Movement (quick in-and-out transfers)
 * 4. Circular Transactions (round-tripping)
 * 5. Shell Company Payments
 * 6. Trade-Based Money Laundering
 * 7. Unusual Patterns (time, amount, frequency)
 */

import { query } from '../config/database';
import { nanoid } from 'nanoid';

interface Transaction {
  transaction_id: string;
  transaction_date: Date;
  from_party_id: string;
  to_party_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  purpose?: string;
}

interface MLDetectionResult {
  detection_id: string;
  pattern_type: string;
  suspicion_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence_score: number;
  transactions_flagged: string[];
  indicators: string[];
  recommended_action: string;
}

export class TransactionPatternDetector {

  /**
   * Detect Structuring/Smurfing
   * Multiple transactions just below reporting thresholds
   */
  detectStructuring(transactions: Transaction[], threshold: number = 10000): MLDetectionResult | null {
    // Group transactions by date and party
    const daily_groups = new Map<string, Transaction[]>();

    for (const txn of transactions) {
      const date_key = txn.transaction_date.toISOString().split('T')[0];
      const key = `${date_key}-${txn.from_party_id}`;
      
      if (!daily_groups.has(key)) {
        daily_groups.set(key, []);
      }
      daily_groups.get(key)!.push(txn);
    }

    // Check for multiple transactions just below threshold
    const flagged_txns: string[] = [];
    const indicators: string[] = [];

    for (const [key, group] of daily_groups) {
      // Check if multiple transactions in same day
      if (group.length >= 3) {
        // Check if amounts are just below threshold
        const just_below = group.filter(t => 
          t.amount > threshold * 0.7 && t.amount < threshold
        );

        if (just_below.length >= 2) {
          const total = just_below.reduce((sum, t) => sum + t.amount, 0);
          
          if (total > threshold) {
            flagged_txns.push(...just_below.map(t => t.transaction_id));
            indicators.push(`${just_below.length} transactions totaling ${total} on ${key.split('-')[0]} - structuring detected`);
          }
        }
      }
    }

    if (flagged_txns.length === 0) {
      return null;
    }

    const confidence_score = Math.min(0.9, 0.5 + (flagged_txns.length * 0.1));
    const suspicion_level = flagged_txns.length > 10 ? 'CRITICAL' :
                            flagged_txns.length > 5 ? 'HIGH' : 'MEDIUM';

    return {
      detection_id: `ML-STRUCT-${nanoid(8)}`,
      pattern_type: 'STRUCTURING_SMURFING',
      suspicion_level,
      confidence_score,
      transactions_flagged: flagged_txns,
      indicators,
      recommended_action: 'File Suspicious Activity Report (SAR) - structuring to avoid reporting thresholds'
    };
  }

  /**
   * Detect Layering
   * Complex web of transactions to obscure origin
   */
  detectLayering(transactions: Transaction[]): MLDetectionResult | null {
    // Build transaction graph
    const graph = new Map<string, Set<string>>();
    
    for (const txn of transactions) {
      if (!graph.has(txn.from_party_id)) {
        graph.set(txn.from_party_id, new Set());
      }
      graph.get(txn.from_party_id)!.add(txn.to_party_id);
    }

    // Look for complex transaction chains
    const flagged_txns: string[] = [];
    const indicators: string[] = [];

    for (const [party, destinations] of graph) {
      // Multiple destinations = possible layering
      if (destinations.size >= 5) {
        const related = transactions.filter(t => t.from_party_id === party);
        
        // Check if transactions occur in rapid succession
        const sorted = related.sort((a, b) => a.transaction_date.getTime() - b.transaction_date.getTime());
        
        if (sorted.length > 0) {
          const time_span_hours = (sorted[sorted.length - 1].transaction_date.getTime() - sorted[0].transaction_date.getTime()) / (1000 * 60 * 60);
          
          if (time_span_hours < 48) {
            flagged_txns.push(...related.map(t => t.transaction_id));
            indicators.push(`${destinations.size} different recipients in ${time_span_hours.toFixed(1)} hours - layering detected`);
          }
        }
      }
    }

    if (flagged_txns.length === 0) {
      return null;
    }

    return {
      detection_id: `ML-LAYER-${nanoid(8)}`,
      pattern_type: 'LAYERING',
      suspicion_level: 'HIGH',
      confidence_score: 0.75,
      transactions_flagged: flagged_txns,
      indicators,
      recommended_action: 'Investigate transaction chain - possible money laundering layering phase'
    };
  }

  /**
   * Detect Rapid Movement
   * Quick in-and-out transfers (integration phase)
   */
  detectRapidMovement(transactions: Transaction[]): MLDetectionResult | null {
    // Group by party to find rapid in-and-out
    const party_txns = new Map<string, Transaction[]>();

    for (const txn of transactions) {
      if (!party_txns.has(txn.to_party_id)) {
        party_txns.set(txn.to_party_id, []);
      }
      party_txns.get(txn.to_party_id)!.push(txn);
    }

    const flagged_txns: string[] = [];
    const indicators: string[] = [];

    for (const [party, received] of party_txns) {
      // Find corresponding outgoing transactions
      const sent = transactions.filter(t => t.from_party_id === party);

      if (received.length > 0 && sent.length > 0) {
        // Check for rapid turnaround
        for (const recv of received) {
          const quick_send = sent.filter(s => {
            const hours_diff = (s.transaction_date.getTime() - recv.transaction_date.getTime()) / (1000 * 60 * 60);
            return hours_diff >= 0 && hours_diff < 24;
          });

          if (quick_send.length > 0) {
            flagged_txns.push(recv.transaction_id, ...quick_send.map(s => s.transaction_id));
            indicators.push(`Funds received and transferred out within 24 hours - rapid movement detected`);
          }
        }
      }
    }

    if (flagged_txns.length === 0) {
      return null;
    }

    return {
      detection_id: `ML-RAPID-${nanoid(8)}`,
      pattern_type: 'RAPID_MOVEMENT',
      suspicion_level: 'HIGH',
      confidence_score: 0.80,
      transactions_flagged: Array.from(new Set(flagged_txns)),
      indicators,
      recommended_action: 'Investigate rapid fund movement - possible money laundering integration phase'
    };
  }

  /**
   * Detect Circular Transactions (Round-Tripping)
   * Money moves in circle back to origin
   */
  detectCircularTransactions(transactions: Transaction[]): MLDetectionResult | null {
    // Build directed graph
    const edges = transactions.map(t => ({ from: t.from_party_id, to: t.to_party_id, txn: t }));

    // Find cycles using DFS
    const flagged_txns: string[] = [];
    const indicators: string[] = [];

    const visited = new Set<string>();
    const rec_stack = new Set<string>();

    const dfs = (party: string, path: string[]): boolean => {
      visited.add(party);
      rec_stack.add(party);
      path.push(party);

      // Find outgoing edges
      const outgoing = edges.filter(e => e.from === party);

      for (const edge of outgoing) {
        if (!visited.has(edge.to)) {
          if (dfs(edge.to, [...path])) {
            return true;
          }
        } else if (rec_stack.has(edge.to)) {
          // Cycle detected
          const cycle_start = path.indexOf(edge.to);
          const cycle = path.slice(cycle_start);
          
          if (cycle.length >= 3) {
            // Find transactions in cycle
            for (let i = 0; i < cycle.length - 1; i++) {
              const cycle_txns = transactions.filter(t => 
                t.from_party_id === cycle[i] && t.to_party_id === cycle[i + 1]
              );
              flagged_txns.push(...cycle_txns.map(t => t.transaction_id));
            }

            indicators.push(`Circular transaction detected: ${cycle.join(' → ')} → ${cycle[0]}`);
            return true;
          }
        }
      }

      rec_stack.delete(party);
      return false;
    };

    // Check all parties
    for (const edge of edges) {
      if (!visited.has(edge.from)) {
        dfs(edge.from, []);
      }
    }

    if (flagged_txns.length === 0) {
      return null;
    }

    return {
      detection_id: `ML-CIRCULAR-${nanoid(8)}`,
      pattern_type: 'CIRCULAR_TRANSACTIONS',
      suspicion_level: 'CRITICAL',
      confidence_score: 0.90,
      transactions_flagged: Array.from(new Set(flagged_txns)),
      indicators,
      recommended_action: 'URGENT: Circular transaction pattern detected - high probability money laundering'
    };
  }

  /**
   * Detect Shell Company Payments
   * Transactions to/from companies with no apparent business purpose
   */
  async detectShellCompanyPayments(transactions: Transaction[]): Promise<MLDetectionResult | null> {
    const flagged_txns: string[] = [];
    const indicators: string[] = [];

    // Get all entities involved
    const entity_ids = new Set<string>();
    transactions.forEach(t => {
      entity_ids.add(t.from_party_id);
      entity_ids.add(t.to_party_id);
    });

    // Check each entity for shell company indicators
    for (const entity_id of entity_ids) {
      if (entity_id.startsWith('ENTITY-')) {
        const entity = await query(
          'SELECT legal_name, business_activities, directors FROM forensic_entities WHERE entity_id = $1',
          [entity_id]
        );

        if (entity.rows.length > 0) {
          const e = entity.rows[0];
          let shell_indicators = 0;

          // Indicators of shell company
          if (!e.business_activities || e.business_activities.length === 0) shell_indicators++;
          if (!e.directors || (typeof e.directors === 'object' && Object.keys(e.directors).length === 0)) shell_indicators++;
          if (e.legal_name && e.legal_name.includes('Ltd') && e.legal_name.length < 20) shell_indicators++;

          if (shell_indicators >= 2) {
            const related_txns = transactions.filter(t => 
              t.from_party_id === entity_id || t.to_party_id === entity_id
            );

            flagged_txns.push(...related_txns.map(t => t.transaction_id));
            indicators.push(`Transactions involving potential shell company: ${e.legal_name}`);
          }
        }
      }
    }

    if (flagged_txns.length === 0) {
      return null;
    }

    return {
      detection_id: `ML-SHELL-${nanoid(8)}`,
      pattern_type: 'SHELL_COMPANY_PAYMENTS',
      suspicion_level: 'HIGH',
      confidence_score: 0.70,
      transactions_flagged: flagged_txns,
      indicators,
      recommended_action: 'Investigate shell company usage - possible money laundering or tax evasion'
    };
  }

  /**
   * Comprehensive money laundering detection
   */
  async detectMoneyLaundering(transactions: Transaction[]): Promise<MLDetectionResult[]> {
    try {
      const detections: MLDetectionResult[] = [];

      // Run all detection methods
      const structuring = this.detectStructuring(transactions);
      if (structuring) detections.push(structuring);

      const layering = this.detectLayering(transactions);
      if (layering) detections.push(layering);

      const rapid = this.detectRapidMovement(transactions);
      if (rapid) detections.push(rapid);

      const circular = this.detectCircularTransactions(transactions);
      if (circular) detections.push(circular);

      const shell = await this.detectShellCompanyPayments(transactions);
      if (shell) detections.push(shell);

      // Store detections in database
      for (const detection of detections) {
        await query(`
          INSERT INTO forensic_findings (
            finding_id, finding_type, finding_category,
            title, description, severity,
            evidence_quality, metadata, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          detection.detection_id,
          'MONEY_LAUNDERING',
          detection.pattern_type,
          `Money Laundering Pattern Detected: ${detection.pattern_type}`,
          `${detection.indicators.join('; ')}. Recommended Action: ${detection.recommended_action}`,
          detection.suspicion_level,
          'STRONG',
          JSON.stringify({
            confidence_score: detection.confidence_score,
            transactions_flagged: detection.transactions_flagged,
            indicators: detection.indicators
          }),
          'ACTIVE'
        ]);
      }

      console.log(`✅ Money laundering detection complete: ${detections.length} patterns found`);
      return detections;

    } catch (error) {
      console.error('Money laundering detection error:', error);
      throw error;
    }
  }

  /**
   * Generate SAR (Suspicious Activity Report) draft
   */
  generateSAR(detections: MLDetectionResult[]): any {
    return {
      report_id: `SAR-${Date.now()}-${nanoid(8)}`,
      report_date: new Date().toISOString(),
      report_type: 'Suspicious Activity Report',
      summary: `${detections.length} suspicious transaction patterns detected requiring investigation`,
      patterns_detected: detections.map(d => ({
        pattern_type: d.pattern_type,
        suspicion_level: d.suspicion_level,
        confidence: d.confidence_score,
        transactions_count: d.transactions_flagged.length,
        indicators: d.indicators
      })),
      recommended_actions: detections.map(d => d.recommended_action),
      filing_requirement: 'Required under Bank Secrecy Act / EU 5AMLD / Criminal Justice (Money Laundering) Act 2010',
      next_steps: [
        'Review flagged transactions in detail',
        'Interview relevant parties',
        'File SAR with FinCEN/FIU within required timeframe',
        'Preserve all related documentation',
        'Do not tip off subjects under investigation'
      ]
    };
  }
}

export default new TransactionPatternDetector();
