//src/app/profile/page.tsx

'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, BookOpen, Heart, Star, Calendar, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Review {
  _id: string;
  userId: { _id: string; name: string };
  bookId: string;
  bookTitle?: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface Favorite {
  _id: string;
  userId: string;
  bookId: string;
  bookTitle?: string;
  addedAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          setLoading(true);
          console.log('Session user ID:', session.user.id); // Depurar
          
          // Solicitudes a las APIs
          const resReviews = await fetch(`/api/reviews?userId=${encodeURIComponent(session.user.id)}`);
          const resFavorites = await fetch('/api/favorites');
          
          console.log('Reviews response status:', resReviews.status); // Depurar
          console.log('Favorites response status:', resFavorites.status); // Depurar

          if (!resReviews.ok) {
            throw new Error(`Error al cargar reseñas: ${resReviews.statusText}`);
          }
          if (!resFavorites.ok) {
            throw new Error(`Error al cargar favoritos: ${resFavorites.statusText}`);
          }

          const reviewsData = await resReviews.json();
          const favoritesData = await resFavorites.json();

          console.log('Reviews data:', reviewsData); // Depurar
          console.log('Favorites data:', favoritesData); // Depurar

          // Enriquecer datos con Google Books API
          const enrichedReviews = await Promise.all(
            reviewsData.map(async (review: Review) => {
              try {
                console.log('Fetching book for review:', review.bookId); // Depurar
                const bookRes = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(review.bookId)}`);
                if (!bookRes.ok) {
                  throw new Error(`Error al cargar libro ${review.bookId}: ${bookRes.statusText}`);
                }
                const book = await bookRes.json();
                return { ...review, bookTitle: book.volumeInfo?.title || 'Unknown' };
              } catch (err) {
                console.error(`Error al cargar libro ${review.bookId}:`, err);
                return { ...review, bookTitle: 'Unknown' };
              }
            })
          );

          const enrichedFavorites = await Promise.all(
            favoritesData.map(async (favorite: Favorite) => {
              try {
                console.log('Fetching book for favorite:', favorite.bookId); // Depurar
                const bookRes = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(favorite.bookId)}`);
                if (!bookRes.ok) {
                  throw new Error(`Error al cargar libro ${favorite.bookId}: ${bookRes.statusText}`);
                }
                const book = await bookRes.json();
                return { ...favorite, bookTitle: book.volumeInfo?.title || 'Unknown' };
              } catch (err) {
                console.error(`Error al cargar libro ${favorite.bookId}:`, err);
                return { ...favorite, bookTitle: 'Unknown' };
              }
            })
          );

          setReviews(enrichedReviews);
          setFavorites(enrichedFavorites);
        } catch (err: any) {
          console.error('Error en fetchData:', err);
          setError(`No se pudieron cargar los datos: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  const handleDeleteFavorite = async (favoriteId: string) => {
    try {
      const favorite = favorites.find(fav => fav._id === favoriteId);
      if (!favorite) return;

      const res = await fetch(`/api/favorites?bookId=${encodeURIComponent(favorite.bookId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
        alert('Favorito eliminado');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar favorito');
      }
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      alert('Error al eliminar favorito');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
          />
        ))}
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 p-12 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl inline-block mb-6">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Inicia sesión para ver tu perfil
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Accede a tus reseñas y favoritos.</p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02]"
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700 px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Perfil de {session.user.name || 'Usuario'}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4" />
              <span>{session.user.email}</span>
            </div>
          </div>
          <div className="p-8">
            {error && (
              <Alert className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </div>
              </Alert>
            )}

            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Tus Reseñas
                </h2>
              </div>
              {loading && <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />}
              {!loading && reviews.length === 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400">No tienes reseñas aún. ¡Empieza a compartir tus opiniones!</p>
                  <Button
                    asChild
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Link href="/search">Buscar libros</Link>
                  </Button>
                </div>
              )}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {review.rating}/5
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 line-clamp-3">{review.content}</p>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Libro:</span>{' '}
                        <Link
                          href={`/libro/${review.bookId}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                        >
                          {review.bookTitle || review.bookId}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Tus Favoritos
                </h2>
              </div>
              {loading && <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />}
              {!loading && favorites.length === 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400">No tienes libros favoritos aún. ¡Añade tus favoritos!</p>
                  <Button
                    asChild
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Link href="/search">Buscar libros</Link>
                  </Button>
                </div>
              )}
              <div className="space-y-6">
                {favorites.map((favorite) => (
                  <div
                    key={favorite._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-600 dark:text-red-400 fill-current" />
                        <div>
                          <Link
                            href={`/libro/${favorite.bookId}`}
                            className="text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            {favorite.bookTitle || `Libro ID: ${favorite.bookId}`}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            Agregado: {new Date(favorite.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg"
                        onClick={() => handleDeleteFavorite(favorite._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}