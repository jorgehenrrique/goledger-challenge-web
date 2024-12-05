'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ChildrenProps } from '@/types/props';

export function ProtectedRoute({ children }: ChildrenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();

  useEffect(() => {
    if (!token && pathname !== '/login') router.push('/login');
  }, [token, router, pathname]);

  if (!token) return null;

  return <>{children}</>;
}
