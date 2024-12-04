import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

const geistSans = localFont({
  src: '../assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Goledger Music',
  description: 'Goledger Music',
  creator: 'Jorge Henrique',
  authors: [
    { name: 'Jorge Henrique', url: 'https://github.com/jorgehenrrique' },
  ],
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      {
        url: '/music-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/music-240.png',
        sizes: '240x240',
        type: 'image/png',
      },
    ],
  },
  other: {
    icon: '/music-240.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' className='dark'>
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors closeButton position='top-right' />
      </body>
    </html>
  );
}
