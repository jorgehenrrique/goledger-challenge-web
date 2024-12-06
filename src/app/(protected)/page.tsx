'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Music4, Disc3, User2, ListMusic, Loader } from 'lucide-react';
import Link from 'next/link';
import { useExtendedData } from '@/hooks/useExtendedData';
import { useDetails } from '@/hooks/useStates';
import { PlaylistDetails } from '@/components/details/PlaylistDetails';
import { SongDetails } from '@/components/details/SongDetails';
import { AlbumDetails } from '@/components/details/AlbumDetails';
import { ArtistDetails } from '@/components/details/ArtistDetails';
import { ItemType } from '@/types/props';

export default function HomePage() {
  const { detailsDialog, setDetailsDialog } = useDetails();
  const { songs, albums, artists, playlists, isLoading, fetchData } =
    useExtendedData();
  const [detailsToOpen, setDetailsToOpen] = useState<ItemType | null>(null);

  const recentItems = {
    songs: songs.slice(-5),
    albums: albums.slice(-5),
    artists: artists.slice(-5),
    playlists: playlists.slice(-5),
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
              <Card
                key={song['@key']}
                className='p-3 border border-brand-pink/30 hover:bg-brand-pink/10 transition-colors cursor-pointer'
                onClick={() => {
                  setDetailsToOpen('song');
                  setDetailsDialog({ isOpen: true, song });
                }}
              >
                <div className='flex items-center gap-3'>
                  <Music4 className='w-4 h-4 text-brand-pink' />
                  <span className='text-brand-pink'>{song.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-brand-pink' />
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
              <Card
                key={album['@key']}
                className='p-3 border border-indigo-600/30 hover:bg-indigo-600/10 transition-colors cursor-pointer'
                onClick={() => {
                  setDetailsToOpen('album');
                  setDetailsDialog({ isOpen: true, album });
                }}
              >
                <div className='flex items-center gap-3'>
                  <Disc3 className='w-4 h-4 text-indigo-600' />
                  <span className='text-indigo-600'>{album.name}</span>
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
              <Card
                key={artist['@key']}
                className='p-3 border border-brand-indigo/30 hover:bg-brand-indigo/10 transition-colors cursor-pointer'
                onClick={() => {
                  setDetailsToOpen('artist');
                  setDetailsDialog({ isOpen: true, artist });
                }}
              >
                <div className='flex items-center gap-3'>
                  <User2 className='w-4 h-4 text-brand-indigo' />
                  <span className='text-brand-indigo'>{artist.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-brand-indigo' />
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
              <Card
                key={playlist['@key']}
                className={`p-3 border hover:bg-brand-purple/10 transition-colors cursor-pointer ${
                  playlist.private
                    ? 'border-red-500/30'
                    : 'border-brand-purple/30'
                }`}
                onClick={() => {
                  setDetailsToOpen('playlist');
                  setDetailsDialog({ isOpen: true, playlist });
                }}
              >
                <div className='flex items-center gap-3'>
                  <ListMusic className='w-4 h-4 text-brand-purple' />
                  <span className='text-brand-purple'>{playlist.name}</span>
                </div>
              </Card>
            ))}
            {isLoading && (
              <div className='flex justify-center items-center h-full'>
                <Loader className='w-10 h-10 animate-spin text-brand-purple' />
              </div>
            )}
          </div>
        </section>
      </div>

      {detailsToOpen === 'playlist' && (
        <PlaylistDetails
          isOpen={detailsDialog.isOpen}
          onClose={() =>
            setDetailsDialog({
              isOpen: false,
              playlist: null,
            })
          }
          playlist={detailsDialog.playlist!}
          songs={songs.filter((song) =>
            detailsDialog.playlist?.songs.some(
              (s) => s['@key'] === song['@key']
            )
          )}
          albums={albums}
          artists={artists}
        />
      )}

      {detailsToOpen === 'song' && (
        <SongDetails
          isOpen={detailsDialog.isOpen}
          onClose={() =>
            setDetailsDialog({
              isOpen: false,
              song: null,
            })
          }
          song={detailsDialog.song!}
          album={albums.find(
            (album) => album['@key'] === detailsDialog.song?.album['@key']
          )}
          artist={artists.find(
            (artist) =>
              artist['@key'] ===
              albums.find(
                (album) => album['@key'] === detailsDialog.song?.album['@key']
              )?.artist['@key']
          )}
        />
      )}

      {detailsToOpen === 'album' && (
        <AlbumDetails
          isOpen={detailsDialog.isOpen}
          onClose={() =>
            setDetailsDialog({
              isOpen: false,
              album: null,
            })
          }
          album={detailsDialog.album!}
          artist={artists.find(
            (artist) => artist['@key'] === detailsDialog.album?.artist['@key']
          )}
          songs={songs.filter(
            (song) => song.album['@key'] === detailsDialog.album?.['@key']
          )}
        />
      )}

      {detailsToOpen === 'artist' && (
        <ArtistDetails
          isOpen={detailsDialog.isOpen}
          onClose={() =>
            setDetailsDialog({
              isOpen: false,
              artist: null,
            })
          }
          artist={detailsDialog.artist!}
          albums={albums.filter(
            (album) => album.artist['@key'] === detailsDialog.artist?.['@key']
          )}
          songs={songs.filter(
            (song) =>
              albums.find((album) => album['@key'] === song.album['@key'])
                ?.artist['@key'] === detailsDialog.artist?.['@key']
          )}
        />
      )}
    </div>
  );
}
