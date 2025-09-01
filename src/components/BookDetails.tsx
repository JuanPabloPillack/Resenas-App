'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '../types';

export default function BookDetails({ book }: { book: Book }) {
  const { volumeInfo } = book;
  const [imageSrc, setImageSrc] = useState(
    volumeInfo.imageLinks?.large?.replace('&edge=curl', '').replace('http://', 'https://') ||
    volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '').replace('http://', 'https://') ||
    'https://via.placeholder.com/150?text=No+Image'
  );
  const [imageError, setImageError] = useState(false);

  const createMarkup = (html: string) => {
    return { __html: html || '' };
  };

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/150?text=No+Image');
    setImageError(true);
  };

  return (
    <div className="flex mb-4">
      <div>
        <Image
          data-testid="book-image"
          src={imageSrc}
          alt={volumeInfo.title || 'Imagen del libro'}
          width={192} // w-48 = 192px
          height={288} // h-72 = 288px
          className="mr-4 object-cover"
          onError={handleImageError}
        />
        {imageError && (
          <p className="text-red-500 text-sm">No se pudo cargar la imagen del libro.</p>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{volumeInfo.title || 'Sin título'}</h1>
        <p>Autor: {volumeInfo.authors?.join(', ') || 'Desconocido'}</p>
        <p>Publicado: {volumeInfo.publishedDate || 'Desconocido'}</p>
        <p>Páginas: {volumeInfo.pageCount || 'Desconocido'}</p>
        {volumeInfo.description ? (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={createMarkup(volumeInfo.description)}
          />
        ) : (
          <p className="mt-4">No hay descripción disponible.</p>
        )}
      </div>
    </div>
  );
}