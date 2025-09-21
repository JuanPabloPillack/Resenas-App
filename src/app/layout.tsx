//src/app/layout.tsx
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useSession, signOut, SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });



function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white shadow-lg shadow-blue-900/10 dark:shadow-blue-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Reseñas de Libros Facheras</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-sm lg:text-base text-white hover:text-blue-200 transition-colors duration-200"
          >
            Buscar
          </Link>
          {session ? (
            <>
              <Link
                href="/profile"
                className="text-sm lg:text-base text-white hover:text-blue-200 transition-colors duration-200"
              >
                Perfil
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white rounded-lg"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm lg:text-base text-white hover:text-blue-200 transition-colors duration-200"
              >
                Iniciar Sesión
              </Link>
              <Button
                asChild
                className="bg-white text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg"
              >
                <Link href="/register">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}>
        <SessionProvider>
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">{children}</main>
          <footer className="bg-gradient-to-r from-slate-800 to-blue-900 dark:from-slate-900 dark:to-blue-950 text-white py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-semibold">Reseñas de Libros Facheras</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">© 2025 - Explora, lee y comparte tus libros favoritos</p>
              <div className="flex justify-center gap-4">
                <Link href="/about" className="text-sm text-slate-300 hover:text-blue-300 transition-colors duration-200">
                  Sobre Nosotros
                </Link>
                <Link href="/contact" className="text-sm text-slate-300 hover:text-blue-300 transition-colors duration-200">
                  Contacto
                </Link>
                <Link href="/privacy" className="text-sm text-slate-300 hover:text-blue-300 transition-colors duration-200">
                  Privacidad
                </Link>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}