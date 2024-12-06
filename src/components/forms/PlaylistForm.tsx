'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PlaylistPayload } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { PlaylistFormProps } from '@/types/props';
import { useBasicData } from '@/hooks/useBasicData';

export function PlaylistForm({
  playlist,
  onSuccess,
  onCancel,
}: PlaylistFormProps) {
  const { songs, albums, artists, isLoading, setIsLoading, fetchData } =
    useBasicData();
  const [songSearch, setSongSearch] = useState('');
  const [formData, setFormData] = useState({
    name: playlist?.name || '',
    private: playlist?.private || false,
    selectedSongs: playlist?.songs.map((song) => song['@key']) || [],
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSongInfo = (songKey: string) => {
    const song = songs.find((s) => s['@key'] === songKey);
    if (!song)
      return {
        songName: 'Música não encontrada',
        albumName: '',
        artistName: '',
      };

    const album = albums.find((a) => a['@key'] === song.album['@key']);
    if (!album)
      return {
        songName: song.name,
        albumName: 'Álbum não encontrado',
        artistName: '',
      };

    const artist = artists.find((a) => a['@key'] === album.artist['@key']);
    return {
      songName: song.name,
      albumName: album.name,
      artistName: artist?.name || 'Artista não encontrado',
    };
  };

  const filteredSongs = songs.filter((song) => {
    const songInfo = getSongInfo(song['@key']);
    const searchLower = songSearch.toLowerCase();
    return (
      song.name.toLowerCase().includes(searchLower) ||
      songInfo.albumName.toLowerCase().includes(searchLower) ||
      songInfo.artistName.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const songsList = formData.selectedSongs.map((songKey) => ({
        '@assetType': 'song',
        '@key': songKey,
      }));

      if (playlist) {
        const updatePayload: PlaylistPayload & { '@key': string } = {
          '@assetType': 'playlist',
          '@key': playlist['@key'],
          name: formData.name,
          private: formData.private,
          songs: songsList as [],
        };
        await api.updateAsset(updatePayload);
        toast.success('Playlist atualizada com sucesso!');
      } else {
        const createPayload: PlaylistPayload = {
          '@assetType': 'playlist',
          name: formData.name,
          private: formData.private,
          songs: songsList as [],
        };
        await api.createAsset(createPayload);
        toast.success('Playlist criada com sucesso!');
      }
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        playlist ? 'Erro ao atualizar playlist' : 'Erro ao criar playlist',
        {
          description:
            error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Input
          placeholder='Nome da Playlist'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='private'
          checked={formData.private}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, private: checked as boolean }))
          }
        />
        <label
          htmlFor='private'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Playlist Privada
        </label>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Músicas</label>
        <div className='space-y-2'>
          <Input
            placeholder='Buscar músicas por nome, álbum ou artista...'
            value={songSearch}
            onChange={(e) => setSongSearch(e.target.value)}
          />
        </div>
        <div className='border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto'>
          {filteredSongs.map((song) => {
            const { songName, albumName, artistName } = getSongInfo(
              song['@key']
            );
            return (
              <div key={song['@key']} className='flex items-center space-x-2'>
                <Checkbox
                  id={song['@key']}
                  checked={formData.selectedSongs.includes(song['@key'])}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => ({
                        ...prev,
                        selectedSongs: [...prev.selectedSongs, song['@key']],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        selectedSongs: prev.selectedSongs.filter(
                          (key) => key !== song['@key']
                        ),
                      }));
                    }
                  }}
                />
                <label
                  htmlFor={song['@key']}
                  className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {songName} - {albumName} • {artistName}
                </label>
              </div>
            );
          })}
          {filteredSongs.length === 0 && (
            <p className='text-sm text-zinc-500 text-center py-2'>
              {songs.length === 0
                ? 'Carregando músicas...'
                : 'Nenhuma música encontrada'}
            </p>
          )}
        </div>
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : playlist ? (
            'Atualizar'
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
