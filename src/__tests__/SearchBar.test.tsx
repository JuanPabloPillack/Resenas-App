
//src/__tests__/SearchBar.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import SearchBar from '@/components/SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  it('renders search bar correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Busca por título, autor o ISBN (10 o 13 dígitos)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
  });

  it('performs search with valid query', async () => {
    server.use(
      http.get('https://www.googleapis.com/books/v1/volumes', () => {
        return HttpResponse.json({
          items: [
            {
              id: 'test-book-id',
              volumeInfo: {
                title: 'Test Book',
                authors: ['Test Author'],
                imageLinks: { thumbnail: 'https://test.com/image.jpg' },
              },
            },
          ],
        });
      })
    );

    render(<SearchBar onSearch={mockOnSearch} />);

    await userEvent.type(screen.getByPlaceholderText('Busca por título, autor o ISBN (10 o 13 dígitos)'), 'Test Book');
    await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'test-book-id' })]));
    });
  });

  it('handles empty query', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('displays error for no results', async () => {
    server.use(
      http.get('https://www.googleapis.com/books/v1/volumes', () => {
        return HttpResponse.json({ items: [] });
      })
    );

    render(<SearchBar onSearch={mockOnSearch} />);

    await userEvent.type(screen.getByPlaceholderText('Busca por título, autor o ISBN (10 o 13 dígitos)'), 'Nonexistent Book');
    await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    await waitFor(() => {
      expect(screen.getByText('No se encontraron resultados para esta búsqueda.')).toBeInTheDocument();
    });
  });

  it('displays error on API failure', async () => {
    // Mockear console.error para evitar que aparezca en la consola
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    server.use(
      http.get('https://www.googleapis.com/books/v1/volumes', () => {
        return HttpResponse.json({ error: 'API error' }, { status: 500 });
      })
    );

    render(<SearchBar onSearch={mockOnSearch} />);

    await userEvent.type(screen.getByPlaceholderText('Busca por título, autor o ISBN (10 o 13 dígitos)'), 'Test Book');
    await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    await waitFor(() => {
      expect(screen.getByText('Hubo un error al buscar. Intenta de nuevo.')).toBeInTheDocument();
    });

    consoleErrorMock.mockRestore();
  });
});