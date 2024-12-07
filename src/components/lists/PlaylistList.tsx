'use client';

import { Playlist } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card } from '../ui/card';
import { Edit, Trash2, Loader2, ArrowUpDown, ListMusic } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { DeleteAlertDialog } from '../ui/AlertDialog';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PlaylistForm } from '../forms/PlaylistForm';
import { ListProps } from '@/types/props';
import { PlaylistDetails } from '../details/PlaylistDetails';
import { useExtendedData } from '@/hooks/useExtendedData';
import { useCommon, useDelete, useDetails, useDialog } from '@/hooks/useStates';

const ITEMS_PER_PAGE = 10;

export function PlaylistList({ updateList, setUpdateList }: ListProps) {
  const {
    songs,
    albums,
    artists,
    playlists,
    isLoading,
    setIsLoading,
    fetchData,
  } = useExtendedData(() => setUpdateList(false));
  const [sortField, setSortField] = useState<'name' | 'songCount'>('name');
  const { detailsDialog, setDetailsDialog } = useDetails();
  const { editDialog, setEditDialog } = useDialog();
  const { deleteDialog, setDeleteDialog } = useDelete();
  const {
    currentPage,
    sortOrder,
    search,
    setCurrentPage,
    setSortOrder,
    setSearch,
  } = useCommon();

  useEffect(() => {
    fetchData();
  }, [fetchData, updateList]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteAsset('playlist', id);
      toast.success('Playlist removida com sucesso!');
      fetchData();
    } catch (error: unknown) {
      toast.error('Erro ao remover playlist', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setDeleteDialog({
        isOpen: false,
        playlistId: null,
        playlistName: null,
      });
      setIsLoading(false);
    }
  };

  const getPlaylistInfo = (playlist: Playlist) => {
    const songCount = playlist.songs.length;
    return `${songCount} música${songCount !== 1 ? 's' : ''}`;
  };

  const filteredPlaylists = playlists
    .filter((playlist) => {
      const searchLower = search.toLowerCase();
      return playlist.name.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      const compareValue = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'songCount') {
        return a.songs.length > b.songs.length ? compareValue : -compareValue;
      } else {
        return a[sortField] > b[sortField] ? compareValue : -compareValue;
      }
    });

  const totalPages = Math.ceil(filteredPlaylists.length / ITEMS_PER_PAGE);
  const paginatedPlaylists = filteredPlaylists.slice(
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
          placeholder='Buscar playlists...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-xs'
        />
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as 'name' | 'songCount')}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nome</SelectItem>
            <SelectItem value='songCount'>Quantidade de Músicas</SelectItem>
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
        {paginatedPlaylists.map((playlist) => (
          <Card
            key={playlist['@key']}
            className={`p-4 hover:bg-zinc-800/50 transition-colors ${
              playlist.private ? 'border-red-500/30' : 'border-brand-purple/30'
            } overflow-hidden`}
          >
            <div className='flex flex-row justify-between gap-2'>
              <div
                className='flex p-4 items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors rounded-lg'
                onClick={() => setDetailsDialog({ isOpen: true, playlist })}
              >
                <div className='p-2 bg-brand-purple/10 rounded-full w-fit'>
                  <ListMusic className='w-6 h-6 text-brand-purple' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{playlist.name}</h3>
                  <p className='text-sm text-zinc-400'>
                    {getPlaylistInfo(playlist)}
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setEditDialog({ isOpen: true, playlist })}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      playlistId: playlist['@key'],
                      playlistName: playlist.name,
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
          deleteDialog.playlistId && handleDelete(deleteDialog.playlistId)
        }
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            playlistId: null,
            playlistName: null,
          })
        }
        title={`Excluir Playlist ${deleteDialog.playlistName}`}
        description={`Tem certeza que deseja excluir a playlist: ${deleteDialog.playlistName}? Esta ação não pode ser desfeita.`}
      />

      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          !open && setEditDialog({ isOpen: false, playlist: null })
        }
      >
        <DialogContent className='border border-amber-500/30'>
          <DialogHeader>
            <DialogTitle>Editar Playlist</DialogTitle>
            <DialogDescription>
              Edite as informações da playlist
            </DialogDescription>
          </DialogHeader>
          {editDialog.playlist && (
            <PlaylistForm
              playlist={editDialog.playlist}
              onSuccess={() => {
                setEditDialog({ isOpen: false, playlist: null });
                fetchData();
              }}
              onCancel={() => setEditDialog({ isOpen: false, playlist: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      <PlaylistDetails
        isOpen={detailsDialog.isOpen}
        onClose={() => setDetailsDialog({ isOpen: false, playlist: null })}
        playlist={detailsDialog.playlist!}
        songs={songs.filter((song) =>
          detailsDialog.playlist?.songs.some((s) => s['@key'] === song['@key'])
        )}
        albums={albums}
        artists={artists}
      />
    </div>
  );
}
