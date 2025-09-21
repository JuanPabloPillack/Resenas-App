//src/app/libro/[id]/page.tsx
import axios from 'axios';
import BookDetails from '@/components/BookDetails';
import BookPageContent from '@/components/BookPageContent';
import type { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Detalles del libro - App de Reseñas de Libros',
  description: 'Ver detalles y reseñas de un libro',
};

async function getBook(id: string) {
  // Validar que el id sea una cadena no vacía
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error('ID de libro inválido');
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`);
    if (!response.data) {
      throw new Error('No se encontraron datos para este libro');
    }
    return response.data;
  } catch (error) {
    console.error('Error al obtener el libro:', error);
    throw new Error('No se pudo cargar el libro');
  }
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let book = null;
  let error = null;

  try {
    book = await getBook(id);
  } catch (err: any) {
    error = err.message || 'Error al cargar el libro';
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/search"
                className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
                  <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Buscar libros</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Volver a la búsqueda</span>
                </div>
              </Link>
            </div>
          </div>
        </header>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-red-500">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/search"
              className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Buscar libros</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Volver a la búsqueda</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>/</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {book.volumeInfo?.title?.substring(0, 30)}...
              </span>
            </nav>
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative">
          <div className="max-w-7xl mx-auto">
            <BookDetails book={book} />
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative">
        <div className="max-w-7xl mx-auto">
          <BookPageContent bookId={id} initialBook={book} />
        </div>
      </main>
    </div>
  );
}