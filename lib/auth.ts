import { getSession } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isDemo?: boolean;
}

const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@aioos.example',
  name: 'Demo User',
  picture: undefined,
  isDemo: true,
};

export async function getCurrentUser(): Promise<User | null> {
  // Check for demo mode
  const cookieStore = await cookies();
  const demoMode = cookieStore.get('demo_mode');

  if (demoMode?.value === 'true') {
    return DEMO_USER;
  }

  // Check Auth0 session
  try {
    const session = await getSession();
    if (session?.user) {
      return {
        id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.email,
        picture: session.user.picture,
        isDemo: false,
      };
    }
  } catch (error) {
    // Auth0 not configured, check if demo mode is enabled
    if (process.env.DEMO_MODE_ENABLED === 'true') {
      return null;
    }
    console.error('Auth error:', error);
  }

  return null;
}

export function isDemoModeEnabled(): boolean {
  return process.env.DEMO_MODE_ENABLED === 'true';
}
