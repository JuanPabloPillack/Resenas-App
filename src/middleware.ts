// src/middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const protectedPaths = ['/reviews/new', '/profile', '/favorites'];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/reviews/new', '/profile', '/favorites'],
};