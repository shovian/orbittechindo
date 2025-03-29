// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Clear the refresh token cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Set the refresh token cookie to an expired state to effectively delete it
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag for production
      maxAge: 0,  // Setting maxAge to 0 will delete the cookie
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
