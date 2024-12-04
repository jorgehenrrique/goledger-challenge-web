'use client';

import { useState } from 'react';
import { PlaylistList } from '@/components/lists/PlaylistList';
import { PlaylistForm } from '@/components/forms/PlaylistForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function PlaylistsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Playlists</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Nova Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Playlist</DialogTitle>
              <DialogDescription>
                Adicione as informações da nova playlist.
              </DialogDescription>
            </DialogHeader>
            <PlaylistForm
              onSuccess={() => {
                setIsDialogOpen(false);
                setUpdateList(true);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <PlaylistList updateList={updateList} setUpdateList={setUpdateList} />
    </div>
  );
}
