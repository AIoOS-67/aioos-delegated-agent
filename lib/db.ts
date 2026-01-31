import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database path - use /app/data in production (Cloud Run), ./data locally
const dbPath = process.env.DATABASE_PATH || './data/aioos.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    permissions TEXT NOT NULL,
    constraints TEXT,
    expires_at TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    revoked_at TEXT,
    license TEXT,
    reputation TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    steps TEXT,
    result TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
  CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON tasks(agent_id);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_agent_id ON audit_logs(agent_id);
`);

export interface AgentLicense {
  license_type: string;
  jurisdiction: string[];
  permission_level: 'advisory_only' | 'execute_with_human' | 'autonomous';
  permitted_actions: string[];
  prohibited_actions: string[];
  insurance_policy_id: string;
}

export interface AgentReputation {
  tasks_completed: number;
  success_rate: number;
  avg_response_time: number;
  user_rating: number;
  trust_score: number;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  permissions: string[];
  constraints?: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  revoked_at?: string;
  // License System (Patent 1)
  license?: AgentLicense;
  // Reputation System (Patent 3)
  reputation?: AgentReputation;
}

export interface Task {
  id: string;
  agent_id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps?: TaskStep[];
  result?: string;
  created_at: string;
  completed_at?: string;
}

export interface TaskStep {
  step: number;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface AuditLog {
  id: number;
  agent_id?: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
}

// Agent operations
export function createAgent(agent: Omit<Agent, 'created_at' | 'status'>): Agent {
  // Initialize default reputation for new agents
  const defaultReputation: AgentReputation = {
    tasks_completed: 0,
    success_rate: 100,
    avg_response_time: 0,
    user_rating: 5.0,
    trust_score: 50
  };

  const stmt = db.prepare(`
    INSERT INTO agents (id, user_id, name, permissions, constraints, expires_at, status, license, reputation)
    VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
  `);

  stmt.run(
    agent.id,
    agent.user_id,
    agent.name,
    JSON.stringify(agent.permissions),
    agent.constraints || null,
    agent.expires_at || null,
    agent.license ? JSON.stringify(agent.license) : null,
    JSON.stringify(agent.reputation || defaultReputation)
  );

  logAudit(agent.id, agent.user_id, 'agent_created', `Agent "${agent.name}" created with license type: ${agent.license?.license_type || 'Basic'}`);

  return getAgentById(agent.id)!;
}

export function getAgentById(id: string): Agent | null {
  const stmt = db.prepare('SELECT * FROM agents WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  // Check if expired
  if (row.expires_at && new Date(row.expires_at) < new Date() && row.status === 'active') {
    revokeAgent(id, 'system');
    row.status = 'expired';
  }

  return {
    ...row,
    permissions: JSON.parse(row.permissions),
    license: row.license ? JSON.parse(row.license) : undefined,
    reputation: row.reputation ? JSON.parse(row.reputation) : undefined,
  };
}

export function getAgentsByUserId(userId: string): Agent[] {
  const stmt = db.prepare('SELECT * FROM agents WHERE user_id = ? ORDER BY created_at DESC');
  const rows = stmt.all(userId) as any[];

  return rows.map(row => {
    // Check if expired
    if (row.expires_at && new Date(row.expires_at) < new Date() && row.status === 'active') {
      revokeAgent(row.id, 'system');
      row.status = 'expired';
    }

    return {
      ...row,
      permissions: JSON.parse(row.permissions),
      license: row.license ? JSON.parse(row.license) : undefined,
      reputation: row.reputation ? JSON.parse(row.reputation) : undefined,
    };
  });
}

// Update agent reputation after task completion
export function updateAgentReputation(agentId: string, success: boolean, responseTime: number): void {
  const agent = getAgentById(agentId);
  if (!agent || !agent.reputation) return;

  const rep = agent.reputation;
  const newTasksCompleted = rep.tasks_completed + 1;
  const newSuccessRate = ((rep.success_rate * rep.tasks_completed) + (success ? 100 : 0)) / newTasksCompleted;
  const newAvgResponseTime = ((rep.avg_response_time * rep.tasks_completed) + responseTime) / newTasksCompleted;

  // Calculate trust score based on success rate and task count
  const taskBonus = Math.min(newTasksCompleted * 0.5, 25); // Max 25 points from tasks
  const successBonus = newSuccessRate * 0.5; // Max 50 points from success rate
  const baseScore = 25; // Base trust score
  const newTrustScore = Math.min(Math.round(baseScore + taskBonus + successBonus), 100);

  const newReputation: AgentReputation = {
    tasks_completed: newTasksCompleted,
    success_rate: Math.round(newSuccessRate * 10) / 10,
    avg_response_time: Math.round(newAvgResponseTime * 10) / 10,
    user_rating: rep.user_rating,
    trust_score: newTrustScore
  };

  const stmt = db.prepare('UPDATE agents SET reputation = ? WHERE id = ?');
  stmt.run(JSON.stringify(newReputation), agentId);
}

export function revokeAgent(id: string, userId: string): boolean {
  const stmt = db.prepare(`
    UPDATE agents
    SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'active'
  `);

  const result = stmt.run(id);

  if (result.changes > 0) {
    logAudit(id, userId, 'agent_revoked', 'Agent revoked');
    return true;
  }

  return false;
}

export function isAgentValid(id: string): boolean {
  const agent = getAgentById(id);
  if (!agent) return false;
  if (agent.status !== 'active') return false;
  if (agent.expires_at && new Date(agent.expires_at) < new Date()) return false;
  return true;
}

// Task operations
export function createTask(task: Omit<Task, 'created_at' | 'status'>): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (id, agent_id, description, status, steps)
    VALUES (?, ?, ?, 'pending', ?)
  `);

  stmt.run(
    task.id,
    task.agent_id,
    task.description,
    task.steps ? JSON.stringify(task.steps) : null
  );

  return getTaskById(task.id)!;
}

export function getTaskById(id: string): Task | null {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return {
    ...row,
    steps: row.steps ? JSON.parse(row.steps) : undefined,
  };
}

export function getTasksByAgentId(agentId: string): Task[] {
  const stmt = db.prepare('SELECT * FROM tasks WHERE agent_id = ? ORDER BY created_at DESC');
  const rows = stmt.all(agentId) as any[];

  return rows.map(row => ({
    ...row,
    steps: row.steps ? JSON.parse(row.steps) : undefined,
  }));
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.status !== undefined) {
    fields.push('status = ?');
    values.push(updates.status);
  }
  if (updates.steps !== undefined) {
    fields.push('steps = ?');
    values.push(JSON.stringify(updates.steps));
  }
  if (updates.result !== undefined) {
    fields.push('result = ?');
    values.push(updates.result);
  }
  if (updates.status === 'completed' || updates.status === 'failed') {
    fields.push('completed_at = CURRENT_TIMESTAMP');
  }

  if (fields.length === 0) return getTaskById(id);

  values.push(id);
  const stmt = db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getTaskById(id);
}

// Audit logging
export function logAudit(agentId: string | null, userId: string | null, action: string, details?: string) {
  const stmt = db.prepare(`
    INSERT INTO audit_logs (agent_id, user_id, action, details)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(agentId, userId, action, details || null);
}

export function getAuditLogs(agentId?: string, limit = 50): AuditLog[] {
  let stmt;
  if (agentId) {
    stmt = db.prepare('SELECT * FROM audit_logs WHERE agent_id = ? ORDER BY created_at DESC LIMIT ?');
    return stmt.all(agentId, limit) as AuditLog[];
  } else {
    stmt = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?');
    return stmt.all(limit) as AuditLog[];
  }
}

export default db;
