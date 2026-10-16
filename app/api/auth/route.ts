import { NextRequest, NextResponse } from 'next/server';

/**
 * Development-Only Mock Auth Route
 *
 * NOTE: This is strictly a local development workflow convenience for previewing
 * the single store-owner management interface.
 *
 * In production, this endpoint is completely disabled. Production authentication
 * will be provided by Supabase Auth with server-side session cookies and RLS policies.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Mock authentication is disabled in production. Supabase Auth will be configured for production access.' },
      { status: 403 }
    );
  }

  try {
    const { passkey } = await request.json();

    // Development preview passkey or empty dev submission
    const devPasskey = process.env.ADMIN_DEV_PASSKEY || 'owner-preview';

    if (passkey === devPasskey || passkey === 'influx-preview') {
      return NextResponse.json({
        success: true,
        authenticated: true,
        isDevPreview: true,
        notice: 'Development Mock Session Only - Not production authentication',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid preview passkey' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API /api/auth POST] Error during mock auth:', error);
    return NextResponse.json({ error: 'Auth error' }, { status: 500 });
  }
}
