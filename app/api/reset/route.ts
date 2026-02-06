import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { resetUserData } from '@/lib/db';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    resetUserData(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting demo data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
