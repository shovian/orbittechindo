import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod Schema for validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Fake "database" to track registered emails (stored in memory)
const fakeDatabase = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }

    const { name, email, phone } = validatedData.data;

    // Simulate checking if email is already registered
    if (fakeDatabase.has(email)) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Simulate adding user to a "database"
    fakeDatabase.add(email);

    // Generate a fake access token
    const accessToken = `fake-token-${Date.now()}`;

    // Fake delay to simulate real API response time
    await new Promise((res) => setTimeout(res, 1000));

    return NextResponse.json({
      name,
      email,
      phone,
      accessToken,
      favItems: [], // Empty favorites by default
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
