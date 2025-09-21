//src/__tests__/ReviewList.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { SessionProvider } from 'next-auth/react';
import ReviewList from '@/components/ReviewList';
import { vi } from 'vitest';

describe('ReviewList', () => {
  const mockOnReviewUpdated = vi.fn();
  const mockOnReviewDeleted = vi.fn();
  const reviews = [
    {
      _id: 'review-id',
      userId: { _id: 'user-id', name: 'Test User' },
      bookId: 'test-book-id',
      rating: 4,
      content: 'Great book!',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  it('renders no reviews message when empty', () => {
    render(
      <SessionProvider session={null}>
        <ReviewList reviews={[]} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    expect(screen.getByTestId('no-reviews')).toHaveTextContent('No hay reseñas para este libro.');
  });

  it('renders reviews correctly', () => {
    render(
      <SessionProvider session={null}>
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    expect(screen.getByTestId('review-name-review-id')).toHaveTextContent('Test User');
    expect(screen.getByTestId('review-content-review-id')).toHaveTextContent('Great book!');
    const stars = screen.getAllByTestId(/review-star-review-id-\d/);
    expect(stars.filter((star) => star.classList.contains('text-yellow-400')).length).toBe(4);
    expect(stars.filter((star) => star.classList.contains('text-gray-300')).length).toBe(1);
  });

  it('displays anonymous if userId is null', () => {
    const anonymousReview = [
      {
        ...reviews[0],
        userId: null,
      },
    ];
    render(
      <SessionProvider session={null}>
        <ReviewList reviews={anonymousReview} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    expect(screen.getByTestId('review-name-review-id')).toHaveTextContent('Anónimo');
  });

  it('shows edit and delete buttons for authenticated user', () => {
    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    expect(screen.getByTestId('edit-button-review-id')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button-review-id')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for other users', () => {
    render(
      <SessionProvider
        session={{ user: { id: 'other-user-id', name: 'Other User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    expect(screen.queryByTestId('edit-button-review-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button-review-id')).not.toBeInTheDocument();
  });

  it('edits a review successfully', async () => {
    server.use(
      http.put('http://localhost:3000/api/reviews/review-id', () => {
        return HttpResponse.json({
          _id: 'review-id',
          userId: { _id: 'user-id', name: 'Test User' },
          bookId: 'test-book-id',
          rating: 5,
          content: 'Updated review!',
          createdAt: new Date().toISOString(),
        });
      })
    );

    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('edit-button-review-id'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();

    const stars = screen.getAllByTestId(/edit-star-\d/);
    await userEvent.click(stars[4]); // 5ta estrella
    await userEvent.clear(screen.getByTestId('edit-content'));
    await userEvent.type(screen.getByTestId('edit-content'), 'Updated review!');
    await userEvent.click(screen.getByTestId('save-edit-button'));

    await waitFor(() => {
      expect(mockOnReviewUpdated).toHaveBeenCalledWith({
        _id: 'review-id',
        userId: { _id: 'user-id', name: 'Test User' },
        bookId: 'test-book-id',
        rating: 5,
        content: 'Updated review!',
        createdAt: expect.any(String),
      });
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });
  });

  it('cancels editing a review', async () => {
    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('edit-button-review-id'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('cancel-edit-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });
  });

  it('displays error when editing without authentication', async () => {
    render(
      <SessionProvider session={null}>
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    // Verificar que el botón de edición NO se renderiza sin autenticación
    expect(screen.queryByTestId('edit-button-review-id')).not.toBeInTheDocument();
  });

  it('deletes a review successfully', async () => {
    server.use(
      http.delete('http://localhost:3000/api/reviews/review-id', () => {
        return HttpResponse.json({}, { status: 200 });
      })
    );

    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('delete-button-review-id'));
    await waitFor(() => {
      expect(mockOnReviewDeleted).toHaveBeenCalledWith('review-id');
    });
  });

  it('displays error when editing with invalid rating', async () => {
    const user = userEvent.setup();
    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await user.click(screen.getByTestId('edit-button-review-id'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();

    // Deseleccionar la calificación haciendo clic en la estrella ya seleccionada
    const stars = screen.getAllByTestId(/edit-star-\d/);
    await user.click(stars[3]); // Hacer clic en la estrella 4 (seleccionada inicialmente)
    await user.clear(screen.getByTestId('edit-content'));
    await user.type(screen.getByTestId('edit-content'), 'Valid content');
    await user.click(screen.getByTestId('save-edit-button'));

    await waitFor(() => {
      expect(screen.getByText(/Por favor, selecciona una calificación entre 1 y 5/i)).toBeInTheDocument();
    });
  });

  it('displays error when editing with empty content', async () => {
    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('edit-button-review-id'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();

    const stars = screen.getAllByTestId(/edit-star-\d/);
    await userEvent.click(stars[4]); // 5ta estrella
    await userEvent.clear(screen.getByTestId('edit-content')); // Vacía el contenido
    await userEvent.click(screen.getByTestId('save-edit-button'));

    await waitFor(() => {
      expect(screen.getByText(/La reseña no puede estar vacía/i)).toBeInTheDocument();
    });
  });

  it('displays error when API fails to edit review', async () => {
    server.use(
      http.put('http://localhost:3000/api/reviews/review-id', () => {
        return HttpResponse.json({ error: 'Error al editar la reseña' }, { status: 400 });
      })
    );

    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('edit-button-review-id'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();

    const stars = screen.getAllByTestId(/edit-star-\d/);
    await userEvent.click(stars[4]); // 5ta estrella
    await userEvent.clear(screen.getByTestId('edit-content'));
    await userEvent.type(screen.getByTestId('edit-content'), 'Updated review!');
    await userEvent.click(screen.getByTestId('save-edit-button'));

    await waitFor(() => {
      expect(screen.getByText(/Error al editar la reseña/i)).toBeInTheDocument();
      expect(mockOnReviewUpdated).not.toHaveBeenCalled();
    });
  });

  it('displays error when API fails to delete review', async () => {
    server.use(
      http.delete('http://localhost:3000/api/reviews/review-id', () => {
        return HttpResponse.json({ error: 'Error al eliminar la reseña' }, { status: 400 });
      })
    );

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <SessionProvider
        session={{ user: { id: 'user-id', name: 'Test User' }, expires: new Date(Date.now() + 86400000).toISOString() }}
      >
        <ReviewList reviews={reviews} onReviewUpdated={mockOnReviewUpdated} onReviewDeleted={mockOnReviewDeleted} />
      </SessionProvider>
    );

    await userEvent.click(screen.getByTestId('delete-button-review-id'));
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error al eliminar la reseña');
      expect(mockOnReviewDeleted).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });
});