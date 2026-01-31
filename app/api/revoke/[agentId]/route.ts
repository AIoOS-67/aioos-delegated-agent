import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAgentById, revokeAgent } from '@/lib/db';

// Revoke an agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { agentId } = await params;
    const agent = getAgentById(agentId);

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Verify ownership
    if (agent.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (agent.status !== 'active') {
      return NextResponse.json(
        { error: 'Agent is already ' + agent.status },
        { status: 400 }
      );
    }

    const success = revokeAgent(agentId, user.id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to revoke agent' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Agent has been revoked and can no longer execute tasks',
    });
  } catch (error) {
    console.error('Error revoking agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
