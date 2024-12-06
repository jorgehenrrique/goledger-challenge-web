'use client';

import { Album, Artist, Song } from '@/types';
import { Disc3, Music4, User2 } from 'lucide-react';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AlbumDetailsProps {
  album: Album;
  artist?: Artist;
  songs?: Song[];
  isOpen: boolean;
  onClose: () => void;
}

export function AlbumDetails({
  album,
  artist,
  songs,
  isOpen,
  onClose,
}: AlbumDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto border border-indigo-600/30'>
        <DialogHeader>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-indigo-600/10 rounded-full'>
              <Disc3 className='w-8 h-8 text-indigo-600' />
            </div>
            <div>
              <DialogTitle className='text-2xl text-indigo-600'>
                {album?.name}
              </DialogTitle>
              <DialogDescription className='flex items-center gap-2 text-zinc-400'>
                <User2 className='w-4 h-4 text-brand-indigo' />
                <span>{artist?.name || 'Artista desconhecido'}</span>
                <span>•</span>
                <span>{album?.year}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {songs && songs.length > 0 && (
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-3'>Músicas do Álbum</h3>
            <div className='space-y-2'>
              {songs.map((song, index) => (
                <Card key={song['@key']} className='p-3'>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm text-zinc-400 w-6 text-right'>
                      {index + 1}
                    </span>
                    <Music4 className='w-5 h-5 text-brand-pink' />
                    <span className='text-brand-pink'>{song?.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
