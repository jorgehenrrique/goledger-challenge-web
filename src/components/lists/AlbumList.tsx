'use client';

import { Album } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card } from '../ui/card';
import { Disc3, Edit, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
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
import { AlbumForm } from '../forms/AlbumForm';
import { ListProps } from '@/types/props';
import { AlbumDetails } from '../details/AlbumDetails';
import { useBasicData } from '@/hooks/useBasicData';
import useDetails from '@/hooks/useDetails';

const ITEMS_PER_PAGE = 10;

export function AlbumList({ updateList, setUpdateList }: ListProps) {
  const { songs, albums, artists, isLoading, setIsLoading, fetchData } =
    useBasicData(() => setUpdateList(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'year' | 'artist'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const { detailsDialog, setDetailsDialog } = useDetails();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    albumId: string | null;
    albumName: string | null;
  }>({ isOpen: false, albumId: null, albumName: null });

  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    album: Album | null;
  }>({ isOpen: false, album: null });

  // const [detailsDialog, setDetailsDialog] = useState<{
  //   isOpen: boolean;
  //   album: Album | null;
  // }>({ isOpen: false, album: null });

  useEffect(() => {
    fetchData();
  }, [updateList, fetchData]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteAsset('album', id);
      toast.success('Álbum removido com sucesso!');
      fetchData();
    } catch (error: unknown) {
      toast.error('Erro ao remover álbum', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setDeleteDialog({
        isOpen: false,
        albumId: null,
        albumName: null,
      });
      setIsLoading(false);
    }
  };

  const getArtistName = (artistKey: string) => {
    return (
      artists.find((artist) => artist['@key'] === artistKey)?.name ||
      'Artista não encontrado'
    );
  };

  const filteredAlbums = albums
    .filter((album) => {
      const artistName = getArtistName(album.artist['@key']);
      const searchLower = search.toLowerCase();
      return (
        album.name.toLowerCase().includes(searchLower) ||
        artistName.toLowerCase().includes(searchLower) ||
        album.year.toString().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'year') {
        return a.year > b.year ? compareValue : -compareValue;
      } else if (sortField === 'artist') {
        const artistA = getArtistName(a.artist['@key']);
        const artistB = getArtistName(b.artist['@key']);
        return artistA > artistB ? compareValue : -compareValue;
      } else {
        return a.name > b.name ? compareValue : -compareValue;
      }
    });

  const totalPages = Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE);
  const paginatedAlbums = filteredAlbums.slice(
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
          placeholder='Buscar álbuns...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-xs'
        />
        <Select
          value={sortField}
          onValueChange={(value) =>
            setSortField(value as 'name' | 'year' | 'artist')
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nome</SelectItem>
            <SelectItem value='year'>Ano</SelectItem>
            <SelectItem value='artist'>Artista</SelectItem>
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
        {paginatedAlbums.map((album) => (
          <Card
            key={album['@key']}
            className='p-4 hover:bg-zinc-800/50 transition-colors border border-indigo-600/30'
          >
            <div className='flex flex-row justify-between gap-2'>
              <div
                className='flex p-4 items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors rounded-lg'
                onClick={() => setDetailsDialog({ isOpen: true, album })}
              >
                <div className='p-2 bg-indigo-600/10 rounded-full w-fit'>
                  <Disc3 className='w-6 h-6 text-indigo-600' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{album.name}</h3>
                  <p className='text-sm text-zinc-400'>
                    {getArtistName(album.artist['@key'])} • {album.year}
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setEditDialog({ isOpen: true, album })}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      albumId: album['@key'],
                      albumName: album.name,
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
          deleteDialog.albumId && handleDelete(deleteDialog.albumId)
        }
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            albumId: null,
            albumName: null,
          })
        }
        title={`Excluir Álbum ${deleteDialog.albumName}`}
        description={`Tem certeza que deseja excluir o álbum: ${deleteDialog.albumName}? Esta ação não pode ser desfeita.`}
      />

      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          !open && setEditDialog({ isOpen: false, album: null })
        }
      >
        <DialogContent className='border border-amber-500/30'>
          <DialogHeader>
            <DialogTitle>Editar Álbum</DialogTitle>
            <DialogDescription>Edite as informações do álbum</DialogDescription>
          </DialogHeader>
          {editDialog.album && (
            <AlbumForm
              album={editDialog.album}
              onSuccess={() => {
                setEditDialog({ isOpen: false, album: null });
                fetchData();
              }}
              onCancel={() => setEditDialog({ isOpen: false, album: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlbumDetails
        isOpen={detailsDialog.isOpen}
        onClose={() => setDetailsDialog({ isOpen: false, album: null })}
        album={detailsDialog.album!}
        artist={artists.find(
          (artist) => artist['@key'] === detailsDialog.album?.artist['@key']
        )}
        songs={songs.filter(
          (song) => song.album['@key'] === detailsDialog.album?.['@key']
        )}
      />
    </div>
  );
}
