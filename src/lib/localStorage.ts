import { Review, ReviewInput } from '@/types';

export function getReviews(bookId: string): Review[] {
  if (typeof window === 'undefined') return [];
  const reviews = localStorage.getItem(`reviews_${bookId}`);
  return reviews ? JSON.parse(reviews) : [];
}

export function saveReview(bookId: string, review: ReviewInput) {
  const reviews = getReviews(bookId);

  const newReview: Review = {
    id: Date.now(),
    bookId,
    votes: 0,
    ...review,
  };

  reviews.push(newReview);
  localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
}

export function voteReview(bookId: string, reviewId: number, delta: number) {
  const reviews = getReviews(bookId);
  const updated = reviews.map((r) =>
    r.id === reviewId ? { ...r, votes: r.votes + delta } : r
  );
  localStorage.setItem(`reviews_${bookId}`, JSON.stringify(updated));
}
