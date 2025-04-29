import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';

import BackgroundWrapper from '@/components/background_wrapper';
import Navbar from '@/components/Navbar';

import { Toaster } from '@/components/ui/sonner';
import Loader from '@/components/Loader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700']
});

export const metadata: Metadata = {
  title: 'tripGenius🌍',
  description: 'Your Journey, Your Way to Plan Smarter with TripGenius!'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-color-mode="light">
        <body className={poppins.className}>
          <BackgroundWrapper>
            <main>
              <div className="max-w-[1200px] mx-auto">
                <Navbar />
                <Suspense
                  fallback={
                    <Loader addInformation={false} addText={'Loading app...'} />
                  }
                >
                  {children}
                </Suspense>
                <Toaster />
              </div>
            </main>
          </BackgroundWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
