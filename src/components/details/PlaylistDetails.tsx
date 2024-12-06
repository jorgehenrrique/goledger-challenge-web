'use client';

import { Playlist, Song, Album, Artist } from '@/types';
import { ListMusic, Music4 } from 'lucide-react';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlaylistDetailsProps {
  playlist: Playlist;
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  isOpen: boolean;
  onClose: () => void;
}

export function PlaylistDetails({
  playlist,
  songs,
  albums,
  artists,
  isOpen,
  onClose,
}: PlaylistDetailsProps) {
  const getSongInfo = (song: Song) => {
    const album = albums.find((a) => a['@key'] === song.album['@key']);
    const artist = album
      ? artists.find((a) => a['@key'] === album.artist['@key'])
      : null;

    return {
      albumName: album?.name || 'Álbum desconhecido',
      artistName: artist?.name || 'Artista desconhecido',
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-3xl max-h-[80vh] overflow-y-auto ${
          playlist?.private ? 'border-red-500/30' : 'border-brand-purple/30'
        }`}
      >
        <DialogHeader>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-brand-purple/10 rounded-full'>
              <ListMusic className='w-8 h-8 text-brand-purple' />
            </div>
            <div>
              <DialogTitle className='text-2xl text-brand-purple'>
                {playlist?.name}
              </DialogTitle>
              <DialogDescription className='text-zinc-400'>
                {playlist?.private ? 'Playlist Privada' : 'Playlist Pública'} •{' '}
                {playlist?.songs.length} música
                {playlist?.songs.length > 1 ? 's' : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='mt-6'>
          <div className='space-y-2'>
            {songs.map((song, index) => {
              const { albumName, artistName } = getSongInfo(song);
              return (
                <Card key={song['@key']} className='p-3'>
                  <div className='flex items-center gap-3 text-brand-pink'>
                    <span className='text-sm text-zinc-400 w-6 text-right'>
                      {index + 1}
                    </span>
                    <Music4 className='w-5 h-5 text-brand-pink' />
                    <div className='flex-1'>
                      <p>{song?.name}</p>
                      <p className='text-sm text-zinc-400'>
                        {albumName} • {artistName}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
