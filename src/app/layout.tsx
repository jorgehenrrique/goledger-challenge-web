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
  title: 'Goledger Challenge',
  description: 'Goledger Challenge',
  creator: 'Jorge Henrique',
  authors: [
    { name: 'Jorge Henrique', url: 'https://github.com/jorgehenrrique' },
  ],
  icons: {
    shortcut: '../assets/favicon.ico',
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
