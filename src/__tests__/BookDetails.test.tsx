// src/__tests__/BookDetails.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BookDetails from '@/components/BookDetails';
import { vi } from 'vitest';

// Mockear useSession
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mockear useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mockear el componente Image de Next.js
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('BookDetails', () => {
  const book = {
    id: 'test-book-id',
    volumeInfo: {
      title: 'Test Book',
      authors: ['Test Author'],
      description: 'A great book description that is very long...'.repeat(20),
      imageLinks: { thumbnail: 'https://test.com/image.jpg' },
      publishedDate: '2023-01-01',
      publisher: 'Test Publisher',
      pageCount: 300,
      categories: ['Fiction'],
      language: 'es',
      averageRating: 4,
      ratingsCount: 100,
      previewLink: 'https://test.com/preview',
    },
  };

  beforeEach(() => {
    (useSession as any).mockReturnValue({ data: null, status: 'unauthenticated' });
    (useRouter as any).mockReturnValue({ push: vi.fn() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders book details correctly', () => {
    render(<BookDetails book={book} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    
    // Ahora el src debería coincidir con la URL original
    expect(screen.getByRole('img', { name: 'Test Book' })).toHaveAttribute(
      'src',
      'https://test.com/image.jpg'
    );
    
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
    expect(screen.getByText('100 valoraciones')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('Test Publisher')).toBeInTheDocument();
    expect(screen.getByText('es')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver en Google Books/i })).toHaveAttribute('href', 'https://test.com/preview');
  });

  it('handles missing data', () => {
    const bookWithoutData = { id: 'test-book-id', volumeInfo: {} };
    render(<BookDetails book={bookWithoutData} />);
    expect(screen.getByText('Sin título')).toBeInTheDocument();
    expect(screen.getByText('Autor desconocido')).toBeInTheDocument();
    
    // URL del placeholder
    expect(screen.getByRole('img', { name: 'Libro' })).toHaveAttribute(
      'src',
      'https://via.placeholder.com/300x400?text=No+Image'
    );
    
    expect(screen.queryByText('4/5')).not.toBeInTheDocument();
  });

  it('toggles full description', () => {
    render(<BookDetails book={book} />);
    const description = screen.getByText(/A great book description/);
    expect(description.textContent?.length).toBeLessThanOrEqual(303); // Truncated description
    fireEvent.click(screen.getByText('Ver más'));
    expect(description.textContent?.length).toBeGreaterThan(300); // Full description
    fireEvent.click(screen.getByText('Ver menos'));
    expect(description.textContent?.length).toBeLessThanOrEqual(303);
  });
});