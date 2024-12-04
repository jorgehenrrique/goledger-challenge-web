'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChildrenProps } from '@/types/props';
import { usePathname } from 'next/navigation';

export default function ProtectedLayout({ children }: ChildrenProps) {
  const pathname = usePathname();
  const showHeader = pathname === '/';

  return (
    <ProtectedRoute>
      <MainLayout showHeader={showHeader}>{children}</MainLayout>
    </ProtectedRoute>
  );
}
