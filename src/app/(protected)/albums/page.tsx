'use client';

import { useState } from 'react';
import { AlbumList } from '@/components/lists/AlbumList';
import { AlbumForm } from '@/components/forms/AlbumForm';
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

export default function AlbumsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Álbuns</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Novo Álbum
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Álbum</DialogTitle>
              <DialogDescription>
                Adicione as informações do novo álbum.
              </DialogDescription>
            </DialogHeader>
            <AlbumForm
              onSuccess={() => {
                setIsDialogOpen(false);
                setUpdateList(true);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <AlbumList updateList={updateList} setUpdateList={setUpdateList} />
    </div>
  );
}
