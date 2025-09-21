//ubicacion del archivo:src/components/FavoriteButton.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function FavoriteButton({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar si el libro está en favoritos al cargar el componente
  useEffect(() => {
    const checkFavorite = async () => {
      if (!session) return;
      try {
        const res = await fetch('/api/favorites');
        if (!res.ok) {
          throw new Error('Error al verificar favoritos');
        }
        const { favorites } = await res.json();
        setIsFavorite(favorites.includes(bookId));
      } catch (err) {
        console.error('Error al verificar favoritos:', err);
      }
    };
    checkFavorite();
  }, [session, bookId]);

  const handleFavorite = async () => {
    if (!session) {
      alert('Por favor, inicia sesión para añadir a favoritos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = isFavorite ? `/api/favorites?bookId=${bookId}` : '/api/favorites';
      const body = isFavorite ? undefined : JSON.stringify({ bookId });

      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al gestionar favoritos');
      }

      const data = await res.json();
      setIsFavorite(!isFavorite);
      alert(data.message);
    } catch (err: any) {
      setError(err.message || 'Error al gestionar favoritos');
      alert(err.message || 'Error al gestionar favoritos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleFavorite}
        disabled={loading || !session}
        className={`w-full flex items-center gap-2 ${
          isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
        } text-white`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}