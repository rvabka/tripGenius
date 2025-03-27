'use server';

import { hash } from 'bcryptjs';
import db from '@/prisma/db/db';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn } from '@/prisma/auth'; // Import z twojej konfiguracji Auth.js
import { z } from 'zod';

// Schemat walidacji
const signUpSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword']
});

export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    console.log('SignUpAction received form data');

    // Walidacja
    const validationResult = signUpSchema.safeParse({ email, password, confirmPassword });
    if (!validationResult.success) {
      return {
        success: false,
        errors: { form: validationResult.error.errors[0].message }
      };
    }

    // Sprawdź czy użytkownik istnieje
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        errors: { form: 'Użytkownik z tym adresem email już istnieje' }
      };
    }

    // Hash hasła
    const hashedPassword = await hash(password, 10);

    // Utwórz użytkownika
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    console.log('User created successfully:', newUser.id);

    // Automatycznie zaloguj użytkownika po rejestracji
    await signIn('credentials', {
      email,
      password, // NextAuth zahashuje to w funkcji authorize
      redirect: false
    });

    // Przekieruj
    redirect('/dashboard');

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('SignUp error:', error);
    return {
      success: false,
      errors: { form: error instanceof Error ? error.message : 'Registration failed' }
    };
  }
}