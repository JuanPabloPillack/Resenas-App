// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
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