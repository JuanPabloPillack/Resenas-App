//src/__tests__/middleware.test.ts
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';
import { getToken } from 'next-auth/jwt';

// Mock de getToken
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de process.env.NEXTAUTH_SECRET
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('redirects to /login for protected route without token', async () => {
    // Simular usuario no autenticado
    vi.mocked(getToken).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/reviews/new', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(307); // NextResponse.redirect() usa 307 por defecto
    expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });

  it('allows access to protected route with valid token', async () => {
    // Simular usuario autenticado
    vi.mocked(getToken).mockResolvedValue({ id: 'user-id', email: 'test@example.com' });

    const req = new NextRequest('http://localhost:3000/profile', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200); // NextResponse.next() retorna 200
    expect(res.headers.get('location')).toBeNull(); // No redirección
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });

  it('allows access to non-protected route without token', async () => {
    // Simular usuario no autenticado
    vi.mocked(getToken).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/home', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200); // NextResponse.next() retorna 200
    expect(res.headers.get('location')).toBeNull(); // No redirección
    // Remover esta expectativa ya que el middleware sí llama a getToken para verificar el estado de autenticación
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });

  it('allows access to non-protected route with token', async () => {
    // Simular usuario autenticado
    vi.mocked(getToken).mockResolvedValue({ id: 'user-id', email: 'test@example.com' });

    const req = new NextRequest('http://localhost:3000/home', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200); // NextResponse.next() retorna 200
    expect(res.headers.get('location')).toBeNull(); // No redirección
    // Remover esta expectativa ya que el middleware sí llama a getToken para verificar el estado de autenticación
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });

  it('redirects to /login for /favorites without token', async () => {
    // Simular usuario no autenticado
    vi.mocked(getToken).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/favorites', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(307); // NextResponse.redirect() usa 307 por defecto
    expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });

  it('handles subroutes of protected paths', async () => {
    // Simular usuario no autenticado
    vi.mocked(getToken).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/reviews/new/subroute', {
      method: 'GET',
    });

    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(307); // NextResponse.redirect() usa 307 por defecto
    expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    expect(getToken).toHaveBeenCalledWith({ req, secret: 'test-secret' });
  });
});