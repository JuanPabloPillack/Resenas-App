// src/app/api/favorites/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const favorite = await Favorite.findById(id);
    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }
    if (favorite.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Favorite.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Favorite deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting favorite' }, { status: 400 });
  }
}