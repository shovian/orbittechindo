// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyRefreshToken } from '../../data/dummyTokens'; // Adjust path to your token logic

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.get('refreshToken')?.value;

    // If the refresh token is missing, return an error
    if (!refreshToken) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 });
    }

    // Verify the refresh token
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a new access token
    const newAccessToken = generateToken(userId);

    // Return the new access token
    return NextResponse.json( newAccessToken , { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
