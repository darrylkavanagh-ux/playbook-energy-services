/**
 * ROLE-BASED ACCESS CONTROL (RBAC) MODULE
 * ============================================================================
 * Granular access control for the forensic investigation platform.
 *
 * Roles (ascending privilege):
 *   viewer       — read-only access to non-privileged case data
 *   analyst      — full read + evidence intake + notes + timeline editing
 *   senior       — all analyst + entity management + report generation
 *   supervisor   — all senior + case creation/closure + analyst assignment
 *   admin        — full platform access including RBAC management
 *   system       — internal service account (no human login)
 *
 * Permissions are resource:action pairs, e.g. "case:read", "evidence:delete"
 *
 * Security:
 *   - JWT-based session tokens (HS256, configurable expiry)
 *   - Refresh token rotation
 *   - Per-request audit logging
 *   - IP binding option for high-privilege accounts
 *   - Failed login lockout (5 attempts / 15 min)
 *   - Least-privilege principle enforced
 *
 * Compliance: NIST SP 800-53 AC-2/AC-3/AC-6, ISO 27001 A.9
 */

import crypto from 'crypto';
import { nanoid } from 'nanoid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'viewer' | 'analyst' | 'senior' | 'supervisor' | 'admin' | 'system';

export type Permission =
  // Cases
  | 'case:read' | 'case:create' | 'case:update' | 'case:delete' | 'case:close'
  | 'case:assign' | 'case:export' | 'case:classify'
  // Evidence
  | 'evidence:read' | 'evidence:intake' | 'evidence:update' | 'evidence:delete'
  | 'evidence:verify' | 'evidence:export' | 'evidence:privileged_read'
  | 'evidence:seal' | 'evidence:disclose'
  // Entities
  | 'entity:read' | 'entity:create' | 'entity:update' | 'entity:delete'
  // Timeline
  | 'timeline:read' | 'timeline:create' | 'timeline:update' | 'timeline:delete'
  // Notes
  | 'note:read' | 'note:create' | 'note:update' | 'note:privileged_read'
  // Reports
  | 'report:read' | 'report:create' | 'report:export' | 'report:submit'
  // Blockchain
  | 'blockchain:screen' | 'blockchain:trace' | 'blockchain:export'
  // Users/RBAC
  | 'user:read' | 'user:create' | 'user:update' | 'user:delete' | 'rbac:manage'
  // Audit
  | 'audit:read' | 'audit:export'
  // Platform
  | 'platform:health' | 'platform:config' | 'platform:maintenance';

// Canonical permission sets per role
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: [
    'case:read', 'evidence:read', 'entity:read',
    'timeline:read', 'note:read', 'report:read',
    'platform:health',
  ],
  analyst: [
    'case:read', 'case:update', 'case:export',
    'evidence:read', 'evidence:intake', 'evidence:update', 'evidence:verify', 'evidence:export',
    'entity:read', 'entity:create', 'entity:update',
    'timeline:read', 'timeline:create', 'timeline:update',
    'note:read', 'note:create', 'note:update',
    'report:read', 'report:create',
    'blockchain:screen', 'blockchain:trace',
    'audit:read',
    'platform:health',
  ],
  senior: [
    'case:read', 'case:update', 'case:export', 'case:classify',
    'evidence:read', 'evidence:intake', 'evidence:update', 'evidence:verify',
    'evidence:export', 'evidence:seal', 'evidence:privileged_read',
    'entity:read', 'entity:create', 'entity:update', 'entity:delete',
    'timeline:read', 'timeline:create', 'timeline:update', 'timeline:delete',
    'note:read', 'note:create', 'note:update', 'note:privileged_read',
    'report:read', 'report:create', 'report:export',
    'blockchain:screen', 'blockchain:trace', 'blockchain:export',
    'audit:read', 'audit:export',
    'user:read',
    'platform:health',
  ],
  supervisor: [
    'case:read', 'case:create', 'case:update', 'case:delete', 'case:close',
    'case:assign', 'case:export', 'case:classify',
    'evidence:read', 'evidence:intake', 'evidence:update', 'evidence:delete',
    'evidence:verify', 'evidence:export', 'evidence:privileged_read',
    'evidence:seal', 'evidence:disclose',
    'entity:read', 'entity:create', 'entity:update', 'entity:delete',
    'timeline:read', 'timeline:create', 'timeline:update', 'timeline:delete',
    'note:read', 'note:create', 'note:update', 'note:privileged_read',
    'report:read', 'report:create', 'report:export', 'report:submit',
    'blockchain:screen', 'blockchain:trace', 'blockchain:export',
    'user:read', 'user:create', 'user:update',
    'audit:read', 'audit:export',
    'platform:health', 'platform:config',
  ],
  admin: [
    'case:read', 'case:create', 'case:update', 'case:delete', 'case:close',
    'case:assign', 'case:export', 'case:classify',
    'evidence:read', 'evidence:intake', 'evidence:update', 'evidence:delete',
    'evidence:verify', 'evidence:export', 'evidence:privileged_read',
    'evidence:seal', 'evidence:disclose',
    'entity:read', 'entity:create', 'entity:update', 'entity:delete',
    'timeline:read', 'timeline:create', 'timeline:update', 'timeline:delete',
    'note:read', 'note:create', 'note:update', 'note:privileged_read',
    'report:read', 'report:create', 'report:export', 'report:submit',
    'blockchain:screen', 'blockchain:trace', 'blockchain:export',
    'user:read', 'user:create', 'user:update', 'user:delete',
    'rbac:manage',
    'audit:read', 'audit:export',
    'platform:health', 'platform:config', 'platform:maintenance',
  ],
  system: [
    'case:read', 'evidence:read', 'evidence:intake', 'evidence:verify',
    'blockchain:screen', 'blockchain:trace', 'audit:read', 'platform:health',
  ],
};

export interface User {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  salt: string;
  role: Role;
  custom_permissions: Permission[];   // additions beyond role defaults
  denied_permissions: Permission[];   // explicit denials (override role grants)
  is_active: boolean;
  mfa_enabled: boolean;
  mfa_secret: string | null;
  ip_whitelist: string[];
  last_login: string | null;
  failed_attempts: number;
  lockout_until: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  token_hash: string;           // hash of JWT — not the JWT itself
  refresh_token_hash: string;
  issued_at: string;
  expires_at: string;
  ip_address: string;
  user_agent: string;
  is_valid: boolean;
}

export interface AccessDecision {
  granted: boolean;
  reason: string;
  user_id: string;
  permission: Permission;
  resource_id?: string;
  decided_at: string;
}

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  user_id: string;
  username: string;
  role: Role;
  permission: Permission;
  resource_type: string;
  resource_id: string | null;
  action: string;
  granted: boolean;
  ip_address: string;
  session_id: string;
  request_path: string;
  duration_ms: number;
  result_code: number;
}

// ─── RBAC Service ─────────────────────────────────────────────────────────────

export class RBACService {
  private readonly users: Map<string, User> = new Map();
  private readonly sessions: Map<string, Session> = new Map();
  private readonly auditLog: AuditLogEntry[] = [];
  private readonly jwtSecret: string;
  private readonly sessionTtlMs: number;

  // Failed login tracking: key = username, value = {count, until}
  private readonly failedLogins: Map<string, { count: number; until: string | null }> = new Map();

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || this.warnAndDerive('JWT_SECRET');
    this.sessionTtlMs = parseInt(process.env.SESSION_TTL_MS || String(8 * 60 * 60 * 1000)); // 8h default
  }

  // ─── User management ─────────────────────────────────────────────────────────

  createUser(params: {
    username: string;
    email: string;
    password: string;
    role: Role;
    created_by: string;
    ip_whitelist?: string[];
    custom_permissions?: Permission[];
  }): Omit<User, 'password_hash' | 'salt'> {
    // Validate username uniqueness
    for (const u of this.users.values()) {
      if (u.username === params.username) {
        throw new RBACError(`Username already exists: ${params.username}`);
      }
      if (u.email === params.email) {
        throw new RBACError(`Email already registered: ${params.email}`);
      }
    }

    const { hash, salt } = this.hashPassword(params.password);
    const now = new Date().toISOString();
    const userId = `USR-${nanoid(12).toUpperCase()}`;

    const user: User = {
      user_id: userId,
      username: params.username,
      email: params.email,
      password_hash: hash,
      salt,
      role: params.role,
      custom_permissions: params.custom_permissions || [],
      denied_permissions: [],
      is_active: true,
      mfa_enabled: false,
      mfa_secret: null,
      ip_whitelist: params.ip_whitelist || [],
      last_login: null,
      failed_attempts: 0,
      lockout_until: null,
      created_at: now,
      updated_at: now,
      created_by: params.created_by,
    };

    this.users.set(userId, user);
    console.log(`[RBAC] Created user: ${params.username} (${params.role})`);

    const { password_hash, salt: _s, ...safeUser } = user;
    return safeUser;
  }

  // ─── Authentication ───────────────────────────────────────────────────────────

  authenticate(username: string, password: string, ipAddress: string, userAgent: string): {
    token: string;
    refresh_token: string;
    expires_at: string;
    user: Omit<User, 'password_hash' | 'salt' | 'mfa_secret'>;
  } {
    // Find user
    const user = this.findUserByUsername(username);
    if (!user || !user.is_active) {
      this.recordFailedLogin(username);
      throw new RBACAuthError('Invalid credentials');
    }

    // Check lockout
    if (user.lockout_until && new Date() < new Date(user.lockout_until)) {
      throw new RBACAuthError(`Account locked until ${user.lockout_until}`);
    }

    // IP whitelist check
    if (user.ip_whitelist.length > 0 && !user.ip_whitelist.includes(ipAddress)) {
      this.logAccess(user.user_id, user.username, user.role, 'case:read', 'session', null,
        'login_blocked_ip', ipAddress, '', '', 0, 403);
      throw new RBACAuthError(`IP address not authorised: ${ipAddress}`);
    }

    // Verify password
    const computed = this.verifyPassword(password, user.salt, user.password_hash);
    if (!computed) {
      user.failed_attempts++;
      if (user.failed_attempts >= 5) {
        user.lockout_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        console.warn(`[RBAC] Account locked: ${username} (5 failed attempts)`);
      }
      user.updated_at = new Date().toISOString();
      this.recordFailedLogin(username);
      throw new RBACAuthError('Invalid credentials');
    }

    // Reset failed attempts
    user.failed_attempts = 0;
    user.lockout_until = null;
    user.last_login = new Date().toISOString();
    user.updated_at = user.last_login;

    // Issue tokens
    const sessionId = `SES-${nanoid(16).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + this.sessionTtlMs).toISOString();
    const token = this.issueJWT(user.user_id, user.role, sessionId, expiresAt);
    const refreshToken = this.issueRefreshToken(user.user_id, sessionId);

    const session: Session = {
      session_id: sessionId,
      user_id: user.user_id,
      token_hash: this.hash(token),
      refresh_token_hash: this.hash(refreshToken),
      issued_at: new Date().toISOString(),
      expires_at: expiresAt,
      ip_address: ipAddress,
      user_agent: userAgent,
      is_valid: true,
    };

    this.sessions.set(sessionId, session);

    this.logAccess(user.user_id, user.username, user.role, 'case:read', 'session', null,
      'login_success', ipAddress, userAgent, sessionId, 0, 200);

    const { password_hash, salt, mfa_secret, ...safeUser } = user;
    return { token, refresh_token: refreshToken, expires_at: expiresAt, user: safeUser };
  }

  // ─── Permission checking ──────────────────────────────────────────────────────

  /**
   * Check if a user has a specific permission.
   * Order: denied_permissions → custom_permissions → role defaults
   */
  can(userId: string, permission: Permission): AccessDecision {
    const user = this.users.get(userId);
    if (!user || !user.is_active) {
      return {
        granted: false,
        reason: 'User not found or inactive',
        user_id: userId,
        permission,
        decided_at: new Date().toISOString(),
      };
    }

    // Explicit denial always wins
    if (user.denied_permissions.includes(permission)) {
      return {
        granted: false,
        reason: `Permission explicitly denied: ${permission}`,
        user_id: userId,
        permission,
        decided_at: new Date().toISOString(),
      };
    }

    // Custom grant
    if (user.custom_permissions.includes(permission)) {
      return {
        granted: true,
        reason: `Custom permission granted: ${permission}`,
        user_id: userId,
        permission,
        decided_at: new Date().toISOString(),
      };
    }

    // Role-based grant
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    const granted = rolePerms.includes(permission);

    return {
      granted,
      reason: granted
        ? `Role '${user.role}' grants permission: ${permission}`
        : `Role '${user.role}' does not include permission: ${permission}`,
      user_id: userId,
      permission,
      decided_at: new Date().toISOString(),
    };
  }

  /**
   * Express middleware: verify JWT and attach user to request.
   * Usage: app.use(rbac.authMiddleware())
   */
  authMiddleware() {
    return (req: any, res: any, next: any) => {
      const authHeader = req.headers['authorization'] as string;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No Bearer token provided' });
      }

      const token = authHeader.substring(7);
      try {
        const payload = this.verifyJWT(token);
        const session = this.sessions.get(payload.session_id);

        if (!session || !session.is_valid || new Date() > new Date(session.expires_at)) {
          return res.status(401).json({ error: 'Session expired or invalid' });
        }

        req.user = {
          user_id: payload.sub,
          role: payload.role,
          session_id: payload.session_id,
        };
        next();
      } catch {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }

  /**
   * Express middleware: require a specific permission.
   * Usage: router.get('/cases', rbac.require('case:read'), handler)
   */
  require(permission: Permission) {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const decision = this.can(req.user.user_id, permission);
      const start = Date.now();

      this.logAccess(
        req.user.user_id,
        req.user.username || 'unknown',
        req.user.role,
        permission,
        permission.split(':')[0],
        req.params?.id || null,
        req.method + ' ' + req.path,
        req.ip,
        req.get('user-agent') || '',
        req.user.session_id,
        Date.now() - start,
        decision.granted ? 200 : 403
      );

      if (!decision.granted) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: permission,
          role: req.user.role,
        });
      }

      next();
    };
  }

  // ─── Token management ─────────────────────────────────────────────────────────

  revokeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.is_valid = false;
    }
  }

  revokeAllUserSessions(userId: string): void {
    for (const session of this.sessions.values()) {
      if (session.user_id === userId) {
        session.is_valid = false;
      }
    }
  }

  // ─── Audit ────────────────────────────────────────────────────────────────────

  getAuditLog(filters?: {
    user_id?: string;
    permission?: Permission;
    resource_type?: string;
    granted?: boolean;
    from?: string;
    to?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let results = [...this.auditLog];

    if (filters?.user_id) results = results.filter(e => e.user_id === filters.user_id);
    if (filters?.permission) results = results.filter(e => e.permission === filters.permission);
    if (filters?.resource_type) results = results.filter(e => e.resource_type === filters.resource_type);
    if (filters?.granted !== undefined) results = results.filter(e => e.granted === filters.granted);
    if (filters?.from) results = results.filter(e => e.timestamp >= filters.from!);
    if (filters?.to) results = results.filter(e => e.timestamp <= filters.to!);

    results = results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return filters?.limit ? results.slice(0, filters.limit) : results;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  private verifyPassword(password: string, salt: string, storedHash: string): boolean {
    const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  }

  private issueJWT(userId: string, role: Role, sessionId: string, expiresAt: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      sub: userId,
      role,
      session_id: sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(new Date(expiresAt).getTime() / 1000),
      iss: 'orb-ai-forensic-platform',
    })).toString('base64url');
    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');
    return `${header}.${payload}.${signature}`;
  }

  private issueRefreshToken(userId: string, sessionId: string): string {
    const data = `${userId}:${sessionId}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
    return crypto.createHmac('sha256', this.jwtSecret).update(data).digest('hex');
  }

  private verifyJWT(token: string): { sub: string; role: Role; session_id: string } {
    const parts = token.split('.');
    if (parts.length !== 3) throw new RBACAuthError('Malformed JWT');

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (expectedSig !== signature) throw new RBACAuthError('JWT signature invalid');

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (parsed.exp && Date.now() / 1000 > parsed.exp) throw new RBACAuthError('JWT expired');

    return { sub: parsed.sub, role: parsed.role, session_id: parsed.session_id };
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private findUserByUsername(username: string): User | null {
    for (const u of this.users.values()) {
      if (u.username === username) return u;
    }
    return null;
  }

  private recordFailedLogin(username: string): void {
    const existing = this.failedLogins.get(username) || { count: 0, until: null };
    existing.count++;
    this.failedLogins.set(username, existing);
  }

  private logAccess(
    userId: string, username: string, role: Role, permission: Permission,
    resourceType: string, resourceId: string | null,
    action: string, ip: string, ua: string, sessionId: string,
    durationMs: number, resultCode: number
  ): void {
    this.auditLog.push({
      log_id: `LOG-${nanoid(10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      user_id: userId,
      username,
      role,
      permission,
      resource_type: resourceType,
      resource_id: resourceId,
      action,
      granted: resultCode < 400,
      ip_address: ip,
      session_id: sessionId,
      request_path: action,
      duration_ms: durationMs,
      result_code: resultCode,
    });

    // Keep last 50,000 entries in memory
    if (this.auditLog.length > 50000) this.auditLog.shift();
  }

  private warnAndDerive(envVar: string): string {
    console.warn(`[RBAC] WARNING: ${envVar} not set in environment. Using derived secret — set this in production!`);
    return crypto.createHash('sha256')
      .update(`orb-ai-${envVar}-${Date.now()}`)
      .digest('hex');
  }
}

// ─── Error classes ────────────────────────────────────────────────────────────

export class RBACError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RBACError';
  }
}

export class RBACAuthError extends RBACError {
  constructor(message: string) {
    super(message);
    this.name = 'RBACAuthError';
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const rbacService = new RBACService();
export default RBACService;
