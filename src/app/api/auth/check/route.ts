import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 401 });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is missing in the environment variables.');
      return NextResponse.json({ error: 'Server error: Missing JWT secret' }, { status: 500 });
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Return the decoded token information
    return NextResponse.json({ token, decoded });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}