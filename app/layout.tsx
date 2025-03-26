import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import BackgroundWrapper from '@/components/background_wrapper';
import Navbar from '@/components/Navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700']
});

export const metadata: Metadata = {
  title: 'tripGenius🌍',
  description: 'Your Journey, Your Way – Plan Smarter with TripGenius!'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <BackgroundWrapper>
          <main>
            <div className="max-w-[1200px] mx-auto">
              <SessionProvider>
                <Navbar />
                {children}
              </SessionProvider>
            </div>
          </main>
        </BackgroundWrapper>
      </body>
    </html>
  );
}
