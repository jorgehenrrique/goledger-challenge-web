'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Home,
  Music2,
  Mic2,
  Disc3,
  ListMusic,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function Sidebar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Início', href: '/' },
    { icon: Mic2, label: 'Artistas', href: '/artists' },
    { icon: Disc3, label: 'Álbuns', href: '/albums' },
    { icon: Music2, label: 'Músicas', href: '/songs' },
    { icon: ListMusic, label: 'Playlists', href: '/playlists' },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className='w-48 h-screen bg-sidebar p-4 flex flex-col border-r border-border'
    >
      <div className='flex-1'>
        <h1 className='text-xl font-bold mb-8 text-center text-indigo-600'>
          GoLedger Music
        </h1>
        <nav className='space-y-2'>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className='flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors'>
                <item.icon className='w-5 h-5' />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className='space-y-2'>
        <Button
          variant='ghost'
          className='w-full justify-start'
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
          {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        </Button>
        <Button
          variant='ghost'
          className='w-full justify-start'
          onClick={logout}
        >
          <LogOut />
          Sair
        </Button>
      </div>
    </motion.div>
  );
}
