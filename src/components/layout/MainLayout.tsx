'use client';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MainLayoutProps } from '@/types/props';

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
  return (
    <div className='flex h-screen bg-background text-text-primary'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        {showHeader && <Header />}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex-1 p-6 overflow-auto'
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
