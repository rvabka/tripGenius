'use server';

import { compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import db from '@/prisma/db/db';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const rememberMe = formData.get('rememberMe') === 'on';

    console.log('Sign-in attempt:', { email, rememberMe });

    // Walidacja podstawowa
    if (!email || !password) {
      return {
        success: false,
        errors: { form: 'Email and password are required' }
      };
    }

    // Znajdź użytkownika
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.password) {
      // Nie informuj, czy użytkownik istnieje (bezpieczeństwo)
      return {
        success: false,
        errors: { form: 'Invalid email or password' }
      };
    }

    // Sprawdź hasło
    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      return {
        success: false,
        errors: { form: 'Invalid email or password' }
      };
    }

    // W rzeczywistym projekcie tutaj ustawiłbyś sesję/token
    // Np. używając next-auth lub własnego mechanizmu

    // Przykład ustawienia prostego cookie
    if (rememberMe) {
      (await cookies()).set('user_id', user.id, {
        maxAge: 30 * 24 * 60 * 60, // 30 dni
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });
    } else {
      (await cookies()).set('user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });
    }

    console.log('User logged in successfully:', user.id);

    // Przekieruj po udanym logowaniu
    redirect('/');

    // Ta linia nie wykona się po przekierowaniu
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Pozwól na obsługę przekierowania przez Next.js
    }

    console.error('Sign-in error:', error);
    return {
      success: false,
      errors: {
        form: error instanceof Error ? error.message : 'Authentication failed'
      }
    };
  }
}
