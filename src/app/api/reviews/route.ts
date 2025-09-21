// src/app/api/reviews/route.ts

import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { authOptions } from '../auth/[...nextauth]/route';

const reviewSchema = z.object({
  bookId: z.string().min(1, 'El ID del libro es requerido'),
  rating: z.number().int().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación máxima es 5'),
  content: z.string().min(1, 'La reseña no puede estar vacía'),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    const userId = searchParams.get('userId');

    await connectDB();

    const query: any = {};
    if (bookId) query.bookId = bookId;
    if (userId) query.userId = userId;

    const reviews = await Review.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    return NextResponse.json(reviews || [], { status: 200 });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json({ error: 'Error al obtener reseñas', reviews: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = reviewSchema.parse(body);

    await connectDB();

    const existingReview = await Review.findOne({
      bookId: validated.bookId,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Ya has escrito una reseña para este libro' }, { status: 400 });
    }

    const review = new Review({
      userId: session.user.id,
      bookId: validated.bookId,
      rating: validated.rating,
      content: validated.content,
    });

    await review.save();
    const populatedReview = await Review.findById(review._id).populate('userId', 'name email');
    return NextResponse.json(populatedReview, { status: 201 });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
}