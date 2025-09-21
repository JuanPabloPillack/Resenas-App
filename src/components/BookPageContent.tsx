// src/components/BookPageContent.tsx
'use client';
import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import FavoriteButton from './FavoriteButton';
import { Users, TrendingUp, Star, FileText, Calendar, Building2, Globe } from 'lucide-react';

interface Review {
  _id: string;
  userId: { _id: string; name: string } | null;
  bookId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function BookPageContent({ bookId, initialBook }: { bookId: string; initialBook: any }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?bookId=${bookId}`);
        if (!res.ok) {
          throw new Error('Error al cargar reseñas');
        }
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('Error al obtener reseñas:', err);
      }
    };
    fetchReviews();
  }, [bookId]);

  const handleReviewCreated = (newReview: Review) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
      <div className="xl:col-span-3 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700 px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Reseñas de la comunidad
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Descubre qué piensan otros lectores
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    En vivo
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tendencias actuales</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <ReviewList
              reviews={reviews}
              onReviewUpdated={handleReviewUpdated}
              onReviewDeleted={handleReviewDeleted}
            />
          </div>
        </div>
      </div>
      <div className="xl:col-span-1">
        <div className="sticky top-24 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-2xl border border-blue-200/60 dark:border-slate-600/60 shadow-xl shadow-blue-900/5 dark:shadow-slate-900/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Tu reseña
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Comparte tu experiencia
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                ¿Has leído este libro? Tu opinión es valiosa para la comunidad de lectores.
              </p>
              <ReviewForm bookId={bookId} onReviewCreated={handleReviewCreated} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-lg">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  Información del libro
                </h4>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Páginas</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {initialBook.volumeInfo?.pageCount || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Publicado</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {initialBook.volumeInfo?.publishedDate || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Editorial</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-right max-w-[120px] truncate">
                    {initialBook.volumeInfo?.publisher || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Idioma</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase">
                    {initialBook.volumeInfo?.language || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-emerald-200/60 dark:border-slate-600/60 shadow-xl shadow-emerald-900/5 dark:shadow-slate-900/20 p-6">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Acciones rápidas
            </h4>
            <div className="space-y-3">
              <FavoriteButton bookId={bookId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}