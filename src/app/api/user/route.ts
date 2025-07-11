import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName + ' ' + user.lastName,
      imageUrl: user.imageUrl,
      role: 'Supply Chain Manager', // Mock role
      location: 'Bentonville, AR'
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}