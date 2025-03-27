import Google from 'next-auth/providers/google';
import { v4 as uuid } from 'uuid';
import { encode as defaultEncode } from 'next-auth/jwt';
import db from './db/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { schema } from './schema';
import { compare } from 'bcrypt';

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        const validatedCredentials = schema.parse(credentials);

        // Znajdź użytkownika po emailu
        const user = await db.user.findUnique({
          where: {
            email: validatedCredentials.email
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials.');
        }

        // Porównaj hasła używając bcryptjs
        const isValidPassword = await compare(
          validatedCredentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials.');
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true;
      }
      return token;
    }
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return defaultEncode(params);
    }
  }
});
