'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();

  useEffect(() => {
    if (!token && pathname !== '/login') router.push('/login');
  }, [token, router, pathname]);

  if (!token) return null;

  return <>{children}</>;
}
