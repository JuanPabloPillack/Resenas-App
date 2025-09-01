'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Book } from '../types';

export default function BookCard({ book }: { book: Book }) {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '').replace('http://', 'https://') || 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="border p-4 mb-4 flex">
      <Image
        src={thumbnail}
        alt={volumeInfo.title || 'Libro'}
        width={96} // w-24 = 96px
        height={144} // h-36 = 144px
        className="mr-4 object-cover"
      />
      <div>
        <h2 className="text-xl font-bold">{volumeInfo.title || 'Sin título'}</h2>
        <p>Autor: {volumeInfo.authors?.join(', ') || 'Desconocido'}</p>
        <Link href={`/libro/${book.id}`} className="text-blue-500">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}