//src/app/api/votes/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Vote from '@/models/Vote';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { reviewId, value } = await req.json();
    await connectDB();

    const vote = new Vote({
      reviewId,
      userId: session.user.id,
      value,
    });
    await vote.save();

    return NextResponse.json({ message: 'Vote added' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('reviewId');
  await connectDB();

  const query = reviewId ? { reviewId } : {};
  const votes = await Vote.find(query).populate('userId', 'name email');
  return NextResponse.json(votes);
}