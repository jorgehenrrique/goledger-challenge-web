'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Song, Album, Artist, Playlist } from '@/types';
import { Card } from '@/components/ui/card';
import { Music4, Disc3, User2, ListMusic, Loader } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState({
    songs: [] as Song[],
    albums: [] as Album[],
    artists: [] as Artist[],
    playlists: [] as Playlist[],
  });

  useEffect(() => {
    async function fetchRecentItems() {
      try {
        const [songs, albums, artists, playlists] = await Promise.all([
          api.searchAssets<Song>('song'),
          api.searchAssets<Album>('album'),
          api.searchAssets<Artist>('artist'),
          api.searchAssets<Playlist>('playlist'),
        ]);

        setRecentItems({
          songs: songs.result.slice(-5),
          albums: albums.result.slice(-5),
          artists: artists.result.slice(-5),
          playlists: playlists.result.slice(-5),
        });
      } catch (error) {
        console.error('Erro ao carregar itens recentes:', error);
        toast.error('Erro ao carregar itens recentes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentItems();
  }, []);

  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Bem-vindo à sua biblioteca</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Músicas Recentes</h2>
            <Link
              href='/songs'
              className='text-sm text-indigo-500 hover:underline'
            >
              Ver todas
            </Link>
          </div>
          <div className='space-y-2'>
            {recentItems.songs.map((song) => (
              <Card key={song['@key']} className='p-3'>
                <div className='flex items-center gap-3'>
                  <Music4 className='w-4 h-4 text-[#f165ab]' />
                  <span>{song.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-[#f165ab]' />
              </div>
            )}
          </div>
        </section>

        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Álbuns Recentes</h2>
            <Link
              href='/albums'
              className='text-sm text-indigo-500 hover:underline'
            >
              Ver todos
            </Link>
          </div>
          <div className='space-y-2'>
            {recentItems.albums.map((album) => (
              <Card key={album['@key']} className='p-3'>
                <div className='flex items-center gap-3'>
                  <Disc3 className='w-4 h-4 text-indigo-600' />
                  <span>{album.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-indigo-600' />
              </div>
            )}
          </div>
        </section>

        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Artistas Recentes</h2>
            <Link
              href='/artists'
              className='text-sm text-indigo-500 hover:underline'
            >
              Ver todos
            </Link>
          </div>
          <div className='space-y-2'>
            {recentItems.artists.map((artist) => (
              <Card key={artist['@key']} className='p-3'>
                <div className='flex items-center gap-3'>
                  <User2 className='w-4 h-4 text-[#5c3ca8]' />
                  <span>{artist.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-[#5c3ca8]' />
              </div>
            )}
          </div>
        </section>

        <section>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Playlists Recentes</h2>
            <Link
              href='/playlists'
              className='text-sm text-indigo-500 hover:underline'
            >
              Ver todas
            </Link>
          </div>
          <div className='space-y-2'>
            {recentItems.playlists.map((playlist) => (
              <Card key={playlist['@key']} className='p-3'>
                <div className='flex items-center gap-3'>
                  <ListMusic className='w-4 h-4 text-[#9c3267]' />
                  <span>{playlist.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-[#9c3267]' />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
