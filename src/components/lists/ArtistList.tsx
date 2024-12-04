'use client';

import { Artist } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card } from '../ui/card';
import { Mic2, Edit, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { DeleteAlertDialog } from '../ui/AlertDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ArtistForm } from '../forms/ArtistForm';
import { ListProps } from '@/types/props';

const ITEMS_PER_PAGE = 10;

export function ArtistList({ updateList, setUpdateList }: ListProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'country'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    artistId: string | null;
    artistName: string | null;
  }>({ isOpen: false, artistId: null, artistName: null });
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    artist: Artist | null;
  }>({ isOpen: false, artist: null });

  const fetchArtists = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.searchAssets<Artist>('artist');

      setArtists(response.result);
    } catch (error: unknown) {
      toast.error('Erro ao carregar artistas', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
      setUpdateList(false);
    }
  }, [setUpdateList]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists, updateList]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteAsset('artist', id);

      toast.success('Artista removido com sucesso!');
      fetchArtists();
    } catch (error: unknown) {
      toast.error('Erro ao remover artista', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setDeleteDialog({
        isOpen: false,
        artistId: null,
        artistName: null,
      });
      setIsLoading(false);
    }
  };

  const filteredArtists = artists
    .filter(
      (artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.country.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      return a[sortField] > b[sortField] ? compareValue : -compareValue;
    });

  const totalPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-4 items-center'>
        <Input
          placeholder='Buscar artistas...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-xs'
        />
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as 'name' | 'country')}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nome</SelectItem>
            <SelectItem value='country'>País</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant='outline'
          size='icon'
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        >
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {paginatedArtists.map((artist) => (
          <Card key={artist['@key']} className='p-4'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-indigo-600/10 rounded-full'>
                <Mic2 className='w-6 h-6 text-indigo-600' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold'>{artist.name}</h3>
                <p className='text-sm text-zinc-400'>{artist.country}</p>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setEditDialog({ isOpen: true, artist })}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      artistId: artist['@key'],
                      artistName: artist.name,
                    })
                  }
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 mt-4'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}

      <DeleteAlertDialog
        isOpen={deleteDialog.isOpen}
        onConfirm={() =>
          deleteDialog.artistId && handleDelete(deleteDialog.artistId)
        }
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            artistId: null,
            artistName: null,
          })
        }
        title={`Excluir Artista ${deleteDialog.artistName}`}
        description={`Tem certeza que deseja excluir o artista: ${deleteDialog.artistName}? Esta ação não pode ser desfeita.`}
      />

      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          !open && setEditDialog({ isOpen: false, artist: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Artista</DialogTitle>
            <DialogDescription>
              Edite as informações do artista
            </DialogDescription>
          </DialogHeader>
          {editDialog.artist && (
            <ArtistForm
              artist={editDialog.artist}
              onSuccess={() => {
                setEditDialog({ isOpen: false, artist: null });
                fetchArtists();
              }}
              onCancel={() => setEditDialog({ isOpen: false, artist: null })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
