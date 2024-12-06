'use client';

import { Song } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card } from '../ui/card';
import { Music4, Edit, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
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
import { SongForm } from '../forms/SongForm';
import { ListProps } from '@/types/props';
import { SongDetails } from '../details/SongDetails';
import { useBasicData } from '@/hooks/useBasicData';
import useDetails from '@/hooks/useDetails';

const ITEMS_PER_PAGE = 10;

export function SongList({ updateList, setUpdateList }: ListProps) {
  const { songs, albums, artists, isLoading, setIsLoading, fetchData } =
    useBasicData(() => setUpdateList(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'album' | 'artist'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const { detailsDialog, setDetailsDialog } = useDetails();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    songId: string | null;
    songName: string | null;
  }>({ isOpen: false, songId: null, songName: null });

  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    song: Song | null;
  }>({ isOpen: false, song: null });

  // const [detailsDialog, setDetailsDialog] = useState<{
  //   isOpen: boolean;
  //   song: Song | null;
  // }>({ isOpen: false, song: null });

  useEffect(() => {
    fetchData();
  }, [fetchData, updateList]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteAsset('song', id);
      toast.success('Música removida com sucesso!');
      fetchData();
    } catch (error: unknown) {
      toast.error('Erro ao remover música', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setDeleteDialog({
        isOpen: false,
        songId: null,
        songName: null,
      });
      setIsLoading(false);
    }
  };

  const getAlbumInfo = (albumKey: string) => {
    const album = albums.find((a) => a['@key'] === albumKey);
    if (!album)
      return {
        albumName: 'Álbum não encontrado',
        artistName: 'Artista não encontrado',
      };

    const artistName =
      artists.find((a) => a['@key'] === album.artist['@key'])?.name ||
      'Artista não encontrado';
    return {
      albumName: album.name,
      artistName,
    };
  };

  const filteredSongs = songs
    .filter((song) => {
      const { albumName, artistName } = getAlbumInfo(song.album['@key']);
      const searchLower = search.toLowerCase();
      return (
        song.name.toLowerCase().includes(searchLower) ||
        albumName.toLowerCase().includes(searchLower) ||
        artistName.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return a.name > b.name ? compareValue : -compareValue;
      } else if (sortField === 'album') {
        const albumA = getAlbumInfo(a.album['@key']).albumName;
        const albumB = getAlbumInfo(b.album['@key']).albumName;
        return albumA > albumB ? compareValue : -compareValue;
      } else {
        const artistA = getAlbumInfo(a.album['@key']).artistName;
        const artistB = getAlbumInfo(b.album['@key']).artistName;
        return artistA > artistB ? compareValue : -compareValue;
      }
    });

  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const paginatedSongs = filteredSongs.slice(
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
          placeholder='Buscar músicas...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-xs'
        />
        <Select
          value={sortField}
          onValueChange={(value) =>
            setSortField(value as 'name' | 'album' | 'artist')
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nome</SelectItem>
            <SelectItem value='album'>Álbum</SelectItem>
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
        {paginatedSongs.map((song) => {
          const { albumName, artistName } = getAlbumInfo(song.album['@key']);
          return (
            <Card
              key={song['@key']}
              className='p-4 hover:bg-zinc-800/50 transition-colors border border-brand-pink/30'
            >
              <div className='flex flex-row justify-between gap-2'>
                <div
                  className='flex p-4 items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors rounded-lg'
                  onClick={() => setDetailsDialog({ isOpen: true, song })}
                >
                  <div className='p-2 bg-brand-pink/10 rounded-full'>
                    <Music4 className='w-6 h-6 text-brand-pink' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold'>{song.name}</h3>
                    <p className='text-sm text-zinc-400'>
                      {albumName} • {artistName}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setEditDialog({ isOpen: true, song })}
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      setDeleteDialog({
                        isOpen: true,
                        songId: song['@key'],
                        songName: song.name,
                      })
                    }
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
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
          deleteDialog.songId && handleDelete(deleteDialog.songId)
        }
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            songId: null,
            songName: null,
          })
        }
        title={`Excluir Música ${deleteDialog.songName}`}
        description={`Tem certeza que deseja excluir a música: ${deleteDialog.songName}? Esta ação não pode ser desfeita.`}
      />

      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          !open && setEditDialog({ isOpen: false, song: null })
        }
      >
        <DialogContent className='border border-amber-500/30'>
          <DialogHeader>
            <DialogTitle>Editar Música</DialogTitle>
            <DialogDescription>
              Edite as informações da música
            </DialogDescription>
          </DialogHeader>
          {editDialog.song && (
            <SongForm
              song={editDialog.song}
              onSuccess={() => {
                setEditDialog({ isOpen: false, song: null });
                fetchData();
              }}
              onCancel={() => setEditDialog({ isOpen: false, song: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      <SongDetails
        isOpen={detailsDialog.isOpen}
        onClose={() => setDetailsDialog({ isOpen: false, song: null })}
        song={detailsDialog.song!}
        album={albums.find(
          (album) => album['@key'] === detailsDialog.song?.album['@key']
        )}
        artist={artists.find(
          (artist) =>
            artist['@key'] ===
            albums.find(
              (album) => album['@key'] === detailsDialog.song?.album['@key']
            )?.artist['@key']
        )}
      />
    </div>
  );
}
