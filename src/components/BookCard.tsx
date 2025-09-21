//src/components/BookCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Book, Heart, User, ExternalLink } from 'lucide-react';

interface BookCardProps {
  book: {
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      imageLinks?: {
        thumbnail?: string;
      };
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
      categories?: string[];
    };
  };
}

export default function BookCard({ book }: BookCardProps) {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '').replace('http://', 'https://') || 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/60 dark:hover:border-blue-500/60">
      <div className="flex h-full">
        {/* Image Section */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-48 relative overflow-hidden">
            <Image
              src={thumbnail}
              alt={volumeInfo.title || 'Libro'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="128px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {volumeInfo.categories && volumeInfo.categories[0] && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg">
              {volumeInfo.categories[0]}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between min-h-[192px]">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {volumeInfo.title || 'Sin título'}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              {volumeInfo.publishedDate && (
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                  📅 {new Date(volumeInfo.publishedDate + 'T00:00:00Z').getFullYear()}
                </span>
              )}
              {volumeInfo.pageCount && (
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                  📖 {volumeInfo.pageCount}p
                </span>
              )}
            </div>

            {volumeInfo.publisher && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                <span className="font-medium">Editorial:</span> {volumeInfo.publisher}
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <Link 
              href={`/libro/${book.id}`}
              className="group/link inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all duration-200 hover:gap-3"
            >
              <span>Ver detalles</span>
              <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
            </Link>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}