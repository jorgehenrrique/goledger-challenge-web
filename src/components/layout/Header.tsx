'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Search, Music4, Disc3, User2, X, ListMusic } from 'lucide-react';
import { useDetails } from '@/hooks/useStates';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useExtendedData } from '@/hooks/useExtendedData';
import { PlaylistDetails } from '../details/PlaylistDetails';
import { SongDetails } from '../details/SongDetails';
import { AlbumDetails } from '../details/AlbumDetails';
import { ArtistDetails } from '../details/ArtistDetails';
import {
  HandleItemClick,
  ItemType,
  SearchItem,
  SearchResults,
} from '@/types/props';

export function Header() {
  const { songs, albums, artists, playlists, fetchData } = useExtendedData();

  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { detailsDialog, setDetailsDialog } = useDetails();
  const [detailsToOpen, setDetailsToOpen] = useState<ItemType | null>(null);

  const stats = {
    songs: songs.length,
    albums: albums.length,
    artists: artists.length,
  };

  const searchResults: SearchResults = {
    songs: songs
      .filter((song) => song.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 3)
      .map((song) => ({ id: song['@key'], name: song.name, type: 'song' })),
    albums: albums
      .filter((album) =>
        album.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 3)
      .map((album) => ({ id: album['@key'], name: album.name, type: 'album' })),
    artists: artists
      .filter((artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 3)
      .map((artist) => ({
        id: artist['@key'],
        name: artist.name,
        type: 'artist',
      })),
    playlists: playlists
      .filter((playlist) =>
        playlist.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 3)
      .map((playlist) => ({
        id: playlist['@key'],
        name: playlist.name,
        type: 'playlist',
      })),
  };

  const handleItemClick: HandleItemClick = (type, id) => {
    const item = {
      song: songs.find((s) => s['@key'] === id),
      album: albums.find((a) => a['@key'] === id),
      artist: artists.find((a) => a['@key'] === id),
      playlist: playlists.find((p) => p['@key'] === id),
    }[type];

    if (item) {
      setDetailsToOpen(type);
      setDetailsDialog({ isOpen: true, [type]: item });
      setSearch('');
      setShowResults(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <header className='border-b border-zinc-800 px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            placeholder='Buscar em toda biblioteca...'
            className='pl-10 pr-8'
          />
          {search && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 hover:bg-transparent'
              onClick={() => {
                setSearch('');
                setShowResults(false);
              }}
            >
              <X className='h-3 w-3' />
            </Button>
          )}

          {showResults && search && (
            <Card className='absolute top-full mt-2 w-full p-2 space-y-4 border-zinc-800 bg-indigo-900/20 backdrop-blur-dialog z-50 overflow-hidden'>
              {Object.entries(searchResults).map(
                ([category, items]) =>
                  items.length > 0 && (
                    <div key={category} className='space-y-1'>
                      <p className='text-xs text-zinc-400 px-2'>
                        {category === 'songs' && 'Músicas'}
                        {category === 'albums' && 'Álbuns'}
                        {category === 'artists' && 'Artistas'}
                        {category === 'playlists' && 'Playlists'}
                      </p>
                      {items.map((item: SearchItem) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item.type, item.id)}
                          className='flex items-center gap-2 p-2 hover:bg-indigo-800/60 rounded-md cursor-pointer'
                        >
                          {item.type === 'song' && (
                            <Music4 className='w-4 h-4 text-brand-pink' />
                          )}
                          {item.type === 'album' && (
                            <Disc3 className='w-4 h-4 text-indigo-600' />
                          )}
                          {item.type === 'artist' && (
                            <User2 className='w-4 h-4 text-brand-indigo' />
                          )}
                          {item.type === 'playlist' && (
                            <ListMusic className='w-4 h-4 text-brand-purple' />
                          )}
                          <span className='text-sm'>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )
              )}
            </Card>
          )}
        </div>
        <div className='flex gap-8'>
          <div className='flex items-center gap-2'>
            <Music4 className='w-5 h-5 text-brand-pink' />
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
            <User2 className='w-5 h-5 text-brand-indigo' />
            <div>
              <p className='text-sm font-medium'>{stats.artists}</p>
              <p className='text-xs text-zinc-400'>Artistas</p>
            </div>
          </div>
        </div>
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
    </header>
  );
}
