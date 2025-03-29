// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateRefreshToken } from '../../data/dummyTokens';
import { findUserByEmail } from '../../data/dummyUsers';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json(); // Get the login credentials from the request body

  // Check if the email exists
  const user = findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verify the password
  if (user.password !== password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Generate tokens
  const accessToken = generateToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  // Set the refresh token in httpOnly cookie
  const response = NextResponse.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    favItems: user.favItems,
    accessToken, // Include accessToken in JSON response for Zustand
  });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/', // Ensure the cookie is accessible on all routes
    maxAge: 5 * 60, // 5 min expiration
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/', // Ensure the cookie is accessible on all routes
    maxAge: 7 * 24 * 60 * 60, // 7 days expiration
  });

  return response;
}
