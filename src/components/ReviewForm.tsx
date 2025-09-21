// src/components/ReviewForm.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReviewFormProps {
  bookId: string;
  onReviewCreated: (review: any) => void;
}

export default function ReviewForm({ bookId, onReviewCreated }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Por favor, inicia sesión para escribir una reseña');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Por favor, selecciona una calificación entre 1 y 5');
      return;
    }
    if (!content.trim()) {
      setError('La reseña no puede estar vacía');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, rating, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear la reseña');
      }

      const newReview = await res.json();
      setSuccess('Reseña creada con éxito');
      setRating(0);
      setContent('');
      setError('');
      onReviewCreated(newReview); // Notificar al componente padre
    } catch (err: any) {
      setError(err.message || 'Error al crear la reseña');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50">
          <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="rating">Calificación</Label>
        <div id="rating" role="radiogroup" aria-labelledby="rating" className="flex space-x-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="sr-only"
              />
              <Star
                data-testid={`star-${star}`}
                className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                role="radio"
                aria-checked={rating === star}
                onClick={() => setRating(star)}
              />
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="content">Reseña</Label>
        <Input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu opinión sobre el libro..."
          className="h-20"
        />
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        Enviar reseña
      </Button>
    </form>
  );
}