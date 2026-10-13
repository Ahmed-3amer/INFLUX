import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'influx2026';

    if (password === correctPassword) {
      return NextResponse.json({ success: true, authenticated: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Auth error' }, { status: 500 });
  }
}
