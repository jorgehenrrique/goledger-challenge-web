'use client';

import { useEffect, useState } from 'react';
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
import { ArtistDetails } from '../details/ArtistDetails';
import { useBasicData } from '@/hooks/useBasicData';
import { useDelete, useDetails, useDialog } from '@/hooks/useStates';

const ITEMS_PER_PAGE = 10;

export function ArtistList({ updateList, setUpdateList }: ListProps) {
  const { songs, albums, artists, isLoading, setIsLoading, fetchData } =
    useBasicData(() => setUpdateList(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'country'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const { detailsDialog, setDetailsDialog } = useDetails();
  const { editDialog, setEditDialog } = useDialog();
  const { deleteDialog, setDeleteDialog } = useDelete();

  useEffect(() => {
    fetchData();
  }, [fetchData, updateList]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteAsset('artist', id);

      toast.success('Artista removido com sucesso!');
      fetchData();
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
      <div className='flex-1 flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-10 h-10 animate-spin text-indigo-600' />
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
          <Card
            key={artist['@key']}
            className='p-4 hover:bg-zinc-800/50 transition-colors border border-brand-indigo/30'
          >
            <div className='flex flex-row justify-between gap-2'>
              <div
                className='flex p-4 items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors rounded-lg'
                onClick={() => setDetailsDialog({ isOpen: true, artist })}
              >
                <div className='p-2 bg-brand-indigo/10 rounded-full w-fit'>
                  <Mic2 className='w-6 h-6 text-brand-indigo' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{artist.name}</h3>
                  <p className='text-sm text-zinc-400'>{artist.country}</p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
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
        <DialogContent className='border border-amber-500/30'>
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
                fetchData();
              }}
              onCancel={() => setEditDialog({ isOpen: false, artist: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      <ArtistDetails
        isOpen={detailsDialog.isOpen}
        onClose={() => setDetailsDialog({ isOpen: false, artist: null })}
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
    </div>
  );
}
