'use client';

import { useState } from 'react';
import { SongList } from '@/components/lists/SongList';
import { SongForm } from '@/components/forms/SongForm';
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

export default function SongsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Músicas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Nova Música
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Música</DialogTitle>
              <DialogDescription>
                Adicione as informações da nova música.
              </DialogDescription>
            </DialogHeader>
            <SongForm
              onSuccess={() => {
                setIsDialogOpen(false);
                setUpdateList(true);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <SongList updateList={updateList} setUpdateList={setUpdateList} />
    </div>
  );
}
