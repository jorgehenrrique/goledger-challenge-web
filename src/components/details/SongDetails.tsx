'use client';

import { Song, Album, Artist } from '@/types';
import { Music4, Disc3, User2 } from 'lucide-react';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface SongDetailsProps {
  song: Song;
  album?: Album;
  artist?: Artist;
  isOpen: boolean;
  onClose: () => void;
}

export function SongDetails({
  song,
  album,
  artist,
  isOpen,
  onClose,
}: SongDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto border border-brand-pink/30'>
        <DialogHeader>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-brand-pink/10 rounded-full'>
              <Music4 className='w-8 h-8 text-brand-pink' />
            </div>
            <div>
              <DialogTitle className='text-2xl text-brand-pink'>
                {song?.name}
              </DialogTitle>
              <DialogDescription className='flex items-center gap-2 text-zinc-400'>
                {album && (
                  <>
                    <Disc3 className='w-4 h-4 text-indigo-600' />
                    <span>{album.name}</span>
                    <span>•</span>
                  </>
                )}
                {artist && (
                  <>
                    <User2 className='w-4 h-4 text-brand-indigo' />
                    <span>{artist.name}</span>
                  </>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6 mt-6'>
          <section>
            <h3 className='text-lg font-semibold mb-3'>
              Informações da Música
            </h3>
            <Card className='p-4 space-y-3'>
              <div>
                <p className='text-sm text-zinc-400'>Nome</p>
                <div className='flex items-center gap-2'>
                  <Music4 className='w-4 h-4 text-brand-pink' />
                  <p>{song?.name}</p>
                </div>
              </div>
              {album && (
                <div>
                  <p className='text-sm text-zinc-400'>Álbum</p>
                  <div className='flex items-center gap-2'>
                    <Disc3 className='w-4 h-4 text-indigo-600' />
                    <p>
                      {album?.name} ({album?.year})
                    </p>
                  </div>
                </div>
              )}
              {artist && (
                <div>
                  <p className='text-sm text-zinc-400'>Artista</p>
                  <div className='flex items-center gap-2'>
                    <User2 className='w-4 h-4 text-brand-indigo' />
                    <p>
                      {artist?.name} • {artist?.country}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
