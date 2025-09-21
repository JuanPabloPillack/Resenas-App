// src/app/api/favorites/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

const favoriteSchema = z.object({
  bookId: z.string().min(1, 'El ID del libro es requerido'),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookId } = favoriteSchema.parse(body);

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si el libro ya está en favoritos
    if (user.favorites.includes(bookId)) {
      return NextResponse.json({ error: 'El libro ya está en tus favoritos' }, { status: 400 });
    }

    // Añadir el libro a favoritos con timestamp
    user.favorites.push({ bookId, addedAt: new Date() });
    await user.save();

    return NextResponse.json({ message: 'Libro añadido a favoritos', bookId }, { status: 200 });
  } catch (error) {
    console.error('Error al añadir a favoritos:', error);
    return NextResponse.json({ error: 'Error al añadir a favoritos' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    if (!bookId) {
      return NextResponse.json({ error: 'El ID del libro es requerido' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si el libro está en favoritos
    const favoriteIndex = user.favorites.findIndex((fav: any) => fav.bookId === bookId);
    if (favoriteIndex === -1) {
      return NextResponse.json({ error: 'El libro no está en tus favoritos' }, { status: 400 });
    }

    // Eliminar el favorito
    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    return NextResponse.json({ message: 'Libro eliminado de favoritos', bookId }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    return NextResponse.json({ error: 'Error al eliminar de favoritos' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Transformar favorites para que coincida con la interfaz esperada
    const favorites = user.favorites.map((fav: any, index: number) => ({
      _id: `${user._id}-${index}`, // Generar un ID único para cada favorito
      userId: user._id.toString(),
      bookId: fav.bookId || fav, // Compatibilidad con formato anterior
      addedAt: fav.addedAt ? new Date(fav.addedAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 });
  }
}