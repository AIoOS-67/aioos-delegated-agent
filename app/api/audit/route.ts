import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAuditLogs, getAgentsByUserId } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Get user's agents to filter audit logs
    const userAgents = getAgentsByUserId(user.id);
    const userAgentIds = new Set(userAgents.map(a => a.id));

    let logs;
    if (agentId) {
      // Verify user owns this agent
      if (!userAgentIds.has(agentId)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      logs = getAuditLogs(agentId, limit);
    } else {
      // Get all logs and filter to user's agents
      const allLogs = getAuditLogs(undefined, 500);
      logs = allLogs.filter(log =>
        log.user_id === user.id ||
        (log.agent_id && userAgentIds.has(log.agent_id))
      ).slice(0, limit);
    }

    return new Response(
      JSON.stringify({ logs }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
