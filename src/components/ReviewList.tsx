// src/components/ReviewList.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Review {
  _id: string;
  userId: { _id: string; name: string } | null;
  bookId: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[] | undefined; // Permitir undefined
  onReviewUpdated: (review: Review) => void;
  onReviewDeleted: (reviewId: string) => void;
}

export default function ReviewList({ reviews = [], onReviewUpdated, onReviewDeleted }: ReviewListProps) {
  const { data: session } = useSession();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editContent, setEditContent] = useState('');
  const [editError, setEditError] = useState('');

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditContent(review.content);
  };

  const handleSaveEdit = async () => {
    if (!session) {
      setEditError('Por favor, inicia sesión para editar');
      return;
    }
    if (editRating < 1 || editRating > 5) {
      setEditError('Por favor, selecciona una calificación entre 1 y 5');
      return;
    }
    if (!editContent.trim()) {
      setEditError('La reseña no puede estar vacía');
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${editingReview!._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: editRating, content: editContent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al editar la reseña');
      }

      const updatedReview = await res.json();
      onReviewUpdated(updatedReview);
      setEditingReview(null);
      setEditError('');
    } catch (err: any) {
      setEditError(err.message || 'Error al editar la reseña');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!session) {
      alert('Por favor, inicia sesión para eliminar');
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar la reseña');
      }

      onReviewDeleted(reviewId);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la reseña');
    }
  };

  // Si reviews no es un array o está vacío
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <p data-testid="no-reviews" className="text-slate-600 dark:text-slate-400">
        No hay reseñas para este libro.
      </p>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-slate-200 dark:border-slate-700 py-4" data-testid="review-item">
          <div className="flex items-center gap-2">
            <span className="font-semibold" data-testid={`review-name-${review._id}`}>
              {review.userId?.name || 'Anónimo'}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  data-testid={`review-star-${review._id}-${star}`} // Agrega data-testid
                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2" data-testid={`review-content-${review._id}`}>
            {review.content}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {session?.user.id === review.userId?._id && (
            <div className="mt-2 space-x-2">
              <Button
                onClick={() => handleEdit(review)}
                variant="outline"
                data-testid={`edit-button-${review._id}`}
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(review._id)}
                variant="destructive"
                data-testid={`delete-button-${review._id}`}
              >
                Eliminar
              </Button>
            </div>
          )}
        </div>
      ))}
      {editingReview && (
        <div className="mt-4 p-4 border rounded" data-testid="edit-form">
          <h3 className="text-lg font-bold">Editar reseña</h3>
          {editError && (
            <Alert className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-300">{editError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
  <Label htmlFor="editRating">Calificación</Label>
  <div className="flex space-x-1 mt-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        data-testid={`edit-star-${star}`}
        className={`w-6 h-6 cursor-pointer ${star <= editRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        onClick={() => {
          // Si se hace clic en la estrella ya seleccionada, deseleccionar (rating = 0)
          if (star === editRating) {
            setEditRating(0);
          } else {
            setEditRating(star);
          }
        }}
      />
    ))}
  </div>
</div>
            <div>
              <Label htmlFor="editContent">Reseña</Label>
              <Input
                id="editContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Escribe tu opinión..."
                className="h-20"
                data-testid="edit-content"
              />
            </div>
            <div className="space-x-2">
              <Button onClick={handleSaveEdit} data-testid="save-edit-button">
                Guardar
              </Button>
              <Button onClick={() => setEditingReview(null)} variant="outline" data-testid="cancel-edit-button">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}