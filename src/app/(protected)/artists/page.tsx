'use client';

import { useState } from 'react';
import { ArtistList } from '@/components/lists/ArtistList';
import { ArtistForm } from '@/components/forms/ArtistForm';
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

export default function ArtistsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Artistas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Novo Artista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Artista</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Por favor, digite o nome do artista.
            </DialogDescription>
            <ArtistForm
              onSuccess={() => {
                setIsDialogOpen(false);
                setUpdateList(true);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ArtistList updateList={updateList} setUpdateList={setUpdateList} />
    </div>
  );
}
