//src/__tests__/AuthForm.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { SessionProvider, signIn } from 'next-auth/react';
import AuthForm from '@/components/AuthForm';
import { vi } from 'vitest';
import type { SignInAuthorizationParams, SignInResponse } from 'next-auth/react';
import type { ReactNode } from 'react';

// Definir routerPushMock antes del mock
const routerPushMock = vi.fn();

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

// Mock de next-auth/react
vi.mock('next-auth/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-auth/react')>();
  return {
    ...actual,
    signIn: vi.fn<(provider: string, options: SignInAuthorizationParams) => Promise<SignInResponse>>(),
    SessionProvider: ({ children }: { children: ReactNode }) => children,
  };
});

describe('AuthForm', () => {
  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  const renderWithSession = (ui: ReactNode, session = null) => {
    return render(
      <SessionProvider session={session}>
        {ui}
      </SessionProvider>
    );
  };

  it('renders login form correctly', () => {
    renderWithSession(<AuthForm mode="login" />);
    // Usar getByRole para el heading en lugar de getByText
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('renders register form correctly', () => {
    renderWithSession(<AuthForm mode="register" />);
    // Usar getByRole para el heading en lugar de getByText
    expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  it('submits login form with valid credentials', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: null, status: 200, ok: true, url: null });

    renderWithSession(<AuthForm mode="login" />);

    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
      expect(routerPushMock).toHaveBeenCalledWith('/');
    });
  });

  it('displays error for invalid login credentials', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: 'Invalid credentials', status: 401, ok: false, url: null });

    renderWithSession(<AuthForm mode="login" />);

    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('submits register form with valid data', async () => {
    server.use(
      http.post('/api/register', () => HttpResponse.json({}, { status: 200 }))
    );
    vi.mocked(signIn).mockResolvedValue({ error: null, status: 200, ok: true, url: null });

    renderWithSession(<AuthForm mode="register" />);

    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Test User');
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/');
    });
  });

  it('displays error for invalid register data', async () => {
    server.use(
      http.post('/api/register', () =>
        HttpResponse.json({ error: 'User already exists' }, { status: 400 })
      )
    );

    renderWithSession(<AuthForm mode="register" />);

    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Test User');
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    renderWithSession(<AuthForm mode="login" />);

    const passwordInput = screen.getByLabelText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByTestId('toggle-password-visibility'));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByTestId('toggle-password-visibility'));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});