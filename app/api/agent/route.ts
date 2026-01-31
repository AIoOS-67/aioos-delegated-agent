import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/lib/auth';
import { createAgent, getAgentsByUserId } from '@/lib/db';

// Get all agents for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const agents = getAgentsByUserId(user.id);
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new agent
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, permissions, constraints, expiresIn, license } = body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
    }

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json({ error: 'At least one permission is required' }, { status: 400 });
    }

    // Calculate expiration time
    let expires_at: string | undefined;
    if (expiresIn && expiresIn !== 'never') {
      const now = new Date();
      const duration: Record<string, number> = {
        '15m': 15 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      };

      if (duration[expiresIn]) {
        expires_at = new Date(now.getTime() + duration[expiresIn]).toISOString();
      }
    }

    const agent = createAgent({
      id: uuidv4(),
      user_id: user.id,
      name,
      permissions,
      constraints: constraints || undefined,
      expires_at,
      license: license || undefined,
    });

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
