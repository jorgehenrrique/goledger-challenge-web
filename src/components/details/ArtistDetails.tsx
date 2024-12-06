'use client';

import { Artist, Album, Song } from '@/types';
import { User2, Disc3, Music4 } from 'lucide-react';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ArtistDetailsProps {
  artist: Artist;
  albums?: Album[];
  songs?: Song[];
  isOpen: boolean;
  onClose: () => void;
}

export function ArtistDetails({
  artist,
  albums,
  songs,
  isOpen,
  onClose,
}: ArtistDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto border border-brand-indigo/30'>
        <DialogHeader>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-brand-indigo/10 rounded-full'>
              <User2 className='w-8 h-8 text-brand-indigo' />
            </div>
            <div>
              <DialogTitle className='text-2xl text-brand-indigo'>
                {artist?.name}
              </DialogTitle>
              <DialogDescription className='text-zinc-400'>
                {artist?.country}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6 mt-6'>
          {albums && albums.length > 0 && (
            <section>
              <h3 className='text-lg font-semibold mb-3'>Álbuns</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {albums.map((album) => (
                  <Card key={album['@key']} className='p-3'>
                    <div className='flex items-center gap-3'>
                      <Disc3 className='w-5 h-5 text-indigo-600' />
                      <div>
                        <p className='font-medium text-indigo-600'>
                          {album?.name}
                        </p>
                        <p className='text-sm text-zinc-400'>{album?.year}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {songs && songs.length > 0 && (
            <section>
              <h3 className='text-lg font-semibold mb-3'>Músicas</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {songs.map((song) => (
                  <Card key={song['@key']} className='p-3'>
                    <div className='flex items-center gap-3'>
                      <Music4 className='w-5 h-5 text-brand-pink' />
                      <span className='text-brand-pink'>{song?.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
