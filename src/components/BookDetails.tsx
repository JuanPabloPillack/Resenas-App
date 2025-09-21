//src/components/BookDetails.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, User, Calendar, Building2, FileText, Globe, BookOpen, Star, ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface BookDetailsProps {
  book: {
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
        small?: string;
      };
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
      categories?: string[];
      language?: string;
      averageRating?: number;
      ratingsCount?: number;
      previewLink?: string;
      infoLink?: string;
    };
  };
}

export default function BookDetails({ book }: BookDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.small || volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '').replace('http://', 'https://') || 'https://via.placeholder.com/300x400?text=No+Image';

  const handleAddFavorite = async (bookId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsAddingToFavorites(true);
    
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      
      if (res.ok) {
        // Aquí podrías mostrar una notificación toast en lugar de alert
        alert('Libro añadido a favoritos');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al añadir favorito');
      }
    } catch (err) {
      alert('Error al añadir favorito');
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const description = volumeInfo.description;
  const truncatedDescription = description && description.length > 300 
    ? description.substring(0, 300) + '...' 
    : description;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
              {volumeInfo.title || 'Sin título'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <User className="w-4 h-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                {volumeInfo.authors?.join(', ') || 'Autor desconocido'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={thumbnail}
                  alt={volumeInfo.title || 'Libro'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Categories */}
              {volumeInfo.categories && volumeInfo.categories.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {volumeInfo.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            {volumeInfo.averageRating && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl border border-yellow-200/60 dark:border-slate-600/60">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(volumeInfo.averageRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {volumeInfo.averageRating}/5
                    </p>
                    {volumeInfo.ratingsCount && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {volumeInfo.ratingsCount} valoraciones
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              
              
              {volumeInfo.previewLink && (
                <a
                  href={volumeInfo.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ver en Google Books
                </a>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {description && (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-slate-200/60 dark:border-slate-600/60">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Descripción
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {showFullDescription ? description : truncatedDescription}
                  </p>
                  {description.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm mt-3 transition-colors duration-200"
                    >
                      {showFullDescription ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Book Details */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b border-slate-200/60 dark:border-slate-600/60">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  Detalles del libro
                </h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Páginas</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                        {volumeInfo.pageCount || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Publicado</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                        {volumeInfo.publishedDate || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Editorial</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-right max-w-[150px] truncate">
                        {volumeInfo.publisher || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Idioma</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg uppercase">
                        {volumeInfo.language || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book ID (keeping for functionality) */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>ID del libro:</strong> <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded font-mono">{book.id}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}