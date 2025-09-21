//src/__tests__/BookPageContent.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { SessionProvider } from 'next-auth/react';
import BookPageContent from '@/components/BookPageContent';
import { vi } from 'vitest';

describe('BookPageContent', () => {
  const bookId = 'test-book-id';
  const initialBook = { volumeInfo: {} };

  beforeEach(() => {
    server.resetHandlers();
    
    // Handler por defecto que devuelve array vacío para todos los tests
    server.use(
      http.get('/api/reviews', ({ request }) => {
        const url = new URL(request.url);
        const bookId = url.searchParams.get('bookId');
        return HttpResponse.json([]);
      })
    );
  });

  it('renders book page content correctly', async () => {
    render(
      <SessionProvider session={null}>
        <BookPageContent bookId={bookId} initialBook={initialBook} />
      </SessionProvider>
    );

    expect(screen.getByText('Reseñas de la comunidad')).toBeInTheDocument();
    expect(screen.getByText('Tu reseña')).toBeInTheDocument();
    expect(screen.getByText('Información del libro')).toBeInTheDocument();
    expect(screen.getByText('Acciones rápidas')).toBeInTheDocument();

    // Esperar a que se complete la carga inicial
    await waitFor(() => {
      expect(screen.getByTestId('no-reviews')).toBeInTheDocument();
    });
  });

  it('loads reviews from API', async () => {
    // Override el handler para este test específico
    server.use(
      http.get('/api/reviews', ({ request }) => {
        const url = new URL(request.url);
        const bookId = url.searchParams.get('bookId');
        return HttpResponse.json([
          {
            _id: 'review-id',
            userId: { _id: 'user-id', name: 'Test User' },
            bookId: bookId,
            rating: 4,
            content: 'Great book!',
            createdAt: new Date().toISOString(),
          },
        ]);
      })
    );

    render(
      <SessionProvider session={null}>
        <BookPageContent bookId={bookId} initialBook={initialBook} />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Great book!')).toBeInTheDocument();
    });
  });

  it('handles review created', async () => {
    render(
      <SessionProvider session={null}>
        <BookPageContent bookId={bookId} initialBook={initialBook} />
      </SessionProvider>
    );

    // Verificar que el formulario de reseña esté presente
    expect(screen.getByText('Calificación')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu opinión sobre el libro...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar reseña' })).toBeInTheDocument();

    // Esperar a que se complete la carga inicial
    await waitFor(() => {
      expect(screen.getByTestId('no-reviews')).toBeInTheDocument();
    });
  });
});