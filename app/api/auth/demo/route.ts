import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Enter demo mode
export async function POST() {
  if (process.env.DEMO_MODE_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Demo mode is disabled' }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.set('demo_mode', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return NextResponse.json({ success: true });
}

// Exit demo mode
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('demo_mode');

  return NextResponse.json({ success: true });
}
