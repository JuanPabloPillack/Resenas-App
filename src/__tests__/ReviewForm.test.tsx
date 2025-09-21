// src/components/__tests__/ReviewForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import ReviewForm from '@/components/ReviewForm';
import { vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('ReviewForm', () => {
  const bookId = 'test-book-id';
  const onReviewCreated = vi.fn();

  beforeEach(() => {
    (useSession as any).mockReturnValue({
      data: { user: { id: 'user-id', name: 'Test User' } },
      status: 'authenticated',
    });
    server.use(
      http.post('/api/reviews', async () => {
        return HttpResponse.json({
          _id: 'review-id',
          userId: 'user-id',
          userName: 'Test User',
          bookId,
          rating: 4,
          content: 'Great book!',
          createdAt: '2025-09-18',
        });
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the review form correctly', () => {
    render(<ReviewForm bookId={bookId} onReviewCreated={onReviewCreated} />);
    expect(screen.getByText('Calificación')).toBeInTheDocument();
    expect(screen.getByLabelText('Reseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar reseña/i })).toBeInTheDocument();
    expect(screen.getByTestId('star-1')).toBeInTheDocument();
  });

  it('submits a review successfully', async () => {
    render(<ReviewForm bookId={bookId} onReviewCreated={onReviewCreated} />);
    await userEvent.click(screen.getByTestId('star-4'));
    await userEvent.type(screen.getByLabelText('Reseña'), 'Great book!');
    await userEvent.click(screen.getByRole('button', { name: /Enviar reseña/i }));
    await waitFor(() => {
      expect(screen.getByText('Reseña creada con éxito')).toBeInTheDocument();
      expect(onReviewCreated).toHaveBeenCalledWith({
        _id: 'review-id',
        userId: 'user-id',
        userName: 'Test User',
        bookId,
        rating: 4,
        content: 'Great book!',
        createdAt: '2025-09-18',
      });
    });
  });

  it('displays error when not authenticated', async () => {
    (useSession as any).mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<ReviewForm bookId={bookId} onReviewCreated={onReviewCreated} />);
    await userEvent.click(screen.getByRole('button', { name: /Enviar reseña/i }));
    await waitFor(() => {
      expect(screen.getByText('Por favor, inicia sesión para escribir una reseña')).toBeInTheDocument();
    });
  });

  it('displays error when rating is missing', async () => {
    render(<ReviewForm bookId={bookId} onReviewCreated={onReviewCreated} />);
    await userEvent.type(screen.getByLabelText('Reseña'), 'Great book!');
    await userEvent.click(screen.getByRole('button', { name: /Enviar reseña/i }));
    await waitFor(() => {
      expect(screen.getByText('Por favor, selecciona una calificación entre 1 y 5')).toBeInTheDocument();
    });
  });

  it('displays error when content is empty', async () => {
    render(<ReviewForm bookId={bookId} onReviewCreated={onReviewCreated} />);
    await userEvent.click(screen.getByTestId('star-4'));
    await userEvent.click(screen.getByRole('button', { name: /Enviar reseña/i }));
    await waitFor(() => {
      expect(screen.getByText('La reseña no puede estar vacía')).toBeInTheDocument();
    });
  });
});