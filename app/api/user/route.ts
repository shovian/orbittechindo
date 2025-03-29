// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../data/dummyTokens';
import { findUserByEmail } from '../data/dummyUsers';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token

  
  if (!token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = findUserByEmail(userId)
  // Mock user data (replace with actual user data from your database)


  return NextResponse.json(user, { status: 200 });
}
