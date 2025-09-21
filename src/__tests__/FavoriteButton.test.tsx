//src/__tests__/FavoriteButton.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import FavoriteButton from '@/components/FavoriteButton';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('FavoriteButton', () => {
  const bookId = 'test-book-id';
  let alertMock: any;

  beforeEach(() => {
    // Mock global alert
    alertMock = vi.fn();
    Object.defineProperty(window, 'alert', {
      value: alertMock,
      writable: true,
    });
    
    // Reset session to unauthenticated by default
    (useSession as any).mockReturnValue({ 
      data: null, 
      status: 'unauthenticated' 
    });

    // Setup default handlers
    server.use(
      http.get('/api/favorites', () => {
        return HttpResponse.json({ favorites: [] });
      }),
      http.post('/api/favorites', () => {
        return HttpResponse.json({ message: 'Añadido a favoritos' });
      }),
      http.delete('/api/favorites', ({ request }) => {
        return HttpResponse.json({ message: 'Eliminado de favoritos' });
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  // ⭐ ESTE ES EL TEST MODIFICADO (Solución 1)
  it('button is disabled when not authenticated', async () => {
    render(<FavoriteButton bookId={bookId} />);
    
    const button = screen.getByRole('button', { name: /Añadir a favoritos/i });
    
    // Verificar que el botón está deshabilitado cuando no hay sesión
    expect(button).toBeDisabled();
    
    // Intentar hacer click (no debería hacer nada porque está deshabilitado)
    await userEvent.click(button);
    
    // Verificar que no se llamó al alert porque el botón está deshabilitado
    expect(alertMock).not.toHaveBeenCalled();
    
    // El botón debería seguir mostrando "Añadir a favoritos"
    expect(button).toHaveTextContent('Añadir a favoritos');
  });

  it('adds favorite successfully', async () => {
    // Mock authenticated session
    (useSession as any).mockReturnValue({ 
      data: { user: { id: 'user-id' } }, 
      status: 'authenticated' 
    });

    render(<FavoriteButton bookId={bookId} />);
    
    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Añadir a favoritos/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /Añadir a favoritos/i });
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Quitar de favoritos/i })).toBeInTheDocument();
    });
    
    expect(alertMock).toHaveBeenCalledWith('Añadido a favoritos');
  });

  it('removes favorite successfully', async () => {
    // Mock authenticated session
    (useSession as any).mockReturnValue({ 
      data: { user: { id: 'user-id' } }, 
      status: 'authenticated' 
    });

    // Override handler to return bookId in favorites
    server.use(
      http.get('/api/favorites', () => {
        return HttpResponse.json({ favorites: [bookId] });
      })
    );

    render(<FavoriteButton bookId={bookId} />);
    
    // Wait for the component to load and show "Quitar de favoritos"
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Quitar de favoritos/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /Quitar de favoritos/i });
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Añadir a favoritos/i })).toBeInTheDocument();
    });
    
    expect(alertMock).toHaveBeenCalledWith('Eliminado de favoritos');
  });
});