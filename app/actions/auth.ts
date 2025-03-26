'use server';

import { signIn } from '@/prisma/auth';

export async function signInWithGoogle() {
  await signIn('google');
}
