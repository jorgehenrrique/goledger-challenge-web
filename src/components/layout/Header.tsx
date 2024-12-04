'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Search, Music4, Disc3, User2 } from 'lucide-react';
import { api } from '@/services/api';
import { Song, Album, Artist } from '@/types';

export function Header() {
  const [stats, setStats] = useState({
    songs: 0,
    albums: 0,
    artists: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [songs, albums, artists] = await Promise.all([
          api.searchAssets<Song>('song'),
          api.searchAssets<Album>('album'),
          api.searchAssets<Artist>('artist'),
        ]);

        setStats({
          songs: songs.result.length,
          albums: albums.result.length,
          artists: artists.result.length,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    }

    fetchStats();
  }, []);

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
