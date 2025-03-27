import db from './db/db';
import { executeAction } from './executeAction';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Definicja schematu z walidacją zgodności haseł
const signUpSchema = z
  .object({
    email: z.string().email('Nieprawidłowy format email'),
    password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword']
  });

const signUp = async (formData: FormData) => {
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  const confirmPassword = formData.get('confirmPassword')?.toString() || '';

  console.log('Form data received:', {
    email,
    passwordLength: password.length
  });

  return executeAction({
    actionFn: async () => {
      // Walidacja danych
      const validatedData = signUpSchema.parse({
        email,
        password,
        confirmPassword
      });

      // Sprawdź, czy użytkownik już istnieje
      const existingUser = await db.user.findUnique({
        where: { email: validatedData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error('Użytkownik z tym adresem email już istnieje');
      }

      // Hashowanie hasła
      const hashedPassword = await hash(validatedData.password, 10);

      // Tworzenie użytkownika
      return await db.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          password: hashedPassword
        }
      });
    },
    successMessage: 'Rejestracja przebiegła pomyślnie'
  });
};

export { signUp };
