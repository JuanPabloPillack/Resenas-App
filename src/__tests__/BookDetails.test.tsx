import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookDetails from '../components/BookDetails';
import { Book } from '../types';

const book: Book = {
  id: 'test-id',
  volumeInfo: {
    title: 'Test Book',
    authors: ['Author Name'],
    publishedDate: '2023',
    pageCount: 300,
    description: 'Great book!',
    imageLinks: {
      thumbnail: 'http://example.com/image.jpg',
    },
  },
};

describe('BookDetails', () => {
  it('renders book details', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Autor: Author Name')).toBeInTheDocument();
    expect(screen.getByText('Publicado: 2023')).toBeInTheDocument();
    expect(screen.getByText('Páginas: 300')).toBeInTheDocument();
    expect(screen.getByText('Great book!')).toBeInTheDocument();
    // Verificar que la URL optimizada contiene la URL original codificada
    const img = screen.getByRole('img');
    const src = img.getAttribute('src');
    expect(src).toContain(encodeURIComponent('https://example.com/image.jpg'));
  });

  it('handles missing description', () => {
    const bookNoDesc = { ...book, volumeInfo: { ...book.volumeInfo, description: undefined } };
    render(<BookDetails book={bookNoDesc} />);
    expect(screen.getByText('No hay descripción disponible.')).toBeInTheDocument();
  });

  it('handles missing authors', () => {
    const bookNoAuthors = { ...book, volumeInfo: { ...book.volumeInfo, authors: undefined } };
    render(<BookDetails book={bookNoAuthors} />);
    expect(screen.getByText('Autor: Desconocido')).toBeInTheDocument();
  });

  it('handles missing image', () => {
    const bookNoImage = { ...book, volumeInfo: { ...book.volumeInfo, imageLinks: undefined } };
    render(<BookDetails book={bookNoImage} />);
    // Verificar que la URL optimizada contiene el placeholder codificado
    const img = screen.getByRole('img');
    const src = img.getAttribute('src');
    expect(src).toContain(encodeURIComponent('https://via.placeholder.com/150?text=No+Image'));
    expect(screen.getByText('No se pudo cargar la imagen del libro.')).toBeInTheDocument();
  });
});