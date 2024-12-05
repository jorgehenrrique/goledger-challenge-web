'use client';

import { useEffect } from 'react';
import { Input } from '../ui/input';
import { Search, Music4, Disc3, User2 } from 'lucide-react';
import { useBasicData } from '@/hooks/useBasicData';

export function Header() {
  const { songs, albums, artists, fetchData } = useBasicData();

  const stats = {
    songs: songs.length,
    albums: albums.length,
    artists: artists.length,
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <header className='border-b border-zinc-800 px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
          <Input placeholder='Buscar em toda biblioteca...' className='pl-10' />
        </div>
        <div className='flex gap-8'>
          <div className='flex items-center gap-2'>
            <Music4 className='w-5 h-5 text-[#f165ab]' />
            <div>
              <p className='text-sm font-medium'>{stats.songs}</p>
              <p className='text-xs text-zinc-400'>Músicas</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Disc3 className='w-5 h-5 text-indigo-600' />
            <div>
              <p className='text-sm font-medium'>{stats.albums}</p>
              <p className='text-xs text-zinc-400'>Álbuns</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <User2 className='w-5 h-5 text-[#5c3ca8]' />
            <div>
              <p className='text-sm font-medium'>{stats.artists}</p>
              <p className='text-xs text-zinc-400'>Artistas</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
