// src/app/search/SearchBooksClient.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, BookOpen, User, Calendar, Loader2, AlertCircle, Sparkles, TrendingUp, Filter, Grid3X3, List } from 'lucide-react';

export default function SearchBooksClient() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('Error al buscar libros');
      }
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError('No se pudieron cargar los libros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const popularSearches = ['Harry Potter', 'Gabriel García Márquez', 'Ciencia ficción', 'Historia', 'Biografías'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent">
                Descubre tu próxima lectura
              </h1>
            </div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explora millones de libros y encuentra exactamente lo que buscas. Desde clásicos hasta novedades.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700 px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Buscar en nuestra biblioteca
                </h2>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                    placeholder="Buscar por título, autor, género..."
                    disabled={loading}
                  />
                  {loading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Buscar libros
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Vista:</span>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Popular Searches */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Búsquedas populares:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Error en la búsqueda</h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {books.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Resultados de búsqueda
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Encontramos {books.length} libro{books.length !== 1 ? 's' : ''} para "{query}"
                  </p>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {books.map((book: any) => (
                <div
                  key={book.id}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/60 dark:hover:border-blue-500/60 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {book.volumeInfo.imageLinks?.thumbnail ? (
                          <Image
                            src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                            alt={book.volumeInfo.title || 'Libro'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Link
                            href={`/libro/${book.id}`}
                            className="w-full inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                          {book.volumeInfo.title || 'Sin título'}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                            {book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                          </p>
                        </div>
                        {book.volumeInfo.publishedDate && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(book.volumeInfo.publishedDate).getFullYear()}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 relative overflow-hidden">
                          {book.volumeInfo.imageLinks?.thumbnail ? (
                            <Image
                              src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                              alt={book.volumeInfo.title || 'Libro'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between min-h-[128px]">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
                            {book.volumeInfo.title || 'Sin título'}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                              {book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
                            </p>
                          </div>
                          {book.volumeInfo.publishedDate && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(book.volumeInfo.publishedDate).getFullYear()}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <Link
                            href={`/libro/${book.id}`}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all duration-200 hover:gap-3"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && query && !error && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 p-12">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl inline-block mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                No encontramos resultados
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                No pudimos encontrar libros que coincidan con "<strong>{query}</strong>". 
                Intenta con términos diferentes o más generales.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Probar "{search}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}