// src/app/api/reviews/[id]/route.ts
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { authOptions } from '../../auth/[...nextauth]/route';

const reviewSchema = z.object({
  rating: z.number().int().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación máxima es 5'),
  content: z.string().min(1, 'La reseña no puede estar vacía'),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = reviewSchema.parse(body);
    const reviewId = params.id;

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar esta reseña' }, { status: 403 });
    }

    review.rating = validated.rating;
    review.content = validated.content;
    await review.save();

    const populatedReview = await Review.findById(reviewId).populate('userId', 'name email');
    return NextResponse.json(populatedReview, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    return NextResponse.json({ error: 'Error al actualizar la reseña' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const reviewId = params.id;

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar esta reseña' }, { status: 403 });
    }

    await Review.deleteOne({ _id: reviewId });
    return NextResponse.json({ message: 'Reseña eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return NextResponse.json({ error: 'Error al eliminar la reseña' }, { status: 500 });
  }
}