'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Album, Artist, SongPayload } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SongFormProps } from '@/types/props';

export function SongForm({ song, onSuccess, onCancel }: SongFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [formData, setFormData] = useState({
    name: song?.name || '',
    albumKey: song?.album['@key'] || '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [albumsResponse, artistsResponse] = await Promise.all([
          api.searchAssets<Album>('album'),
          api.searchAssets<Artist>('artist'),
        ]);
        setAlbums(albumsResponse.result);
        setArtists(artistsResponse.result);
      } catch (error) {
        toast.error('Erro ao carregar dados', {
          description:
            error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }
    fetchData();
  }, []);

  const getArtistName = (artistKey: string) => {
    return (
      artists.find((artist) => artist['@key'] === artistKey)?.name ||
      'Artista não encontrado'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (song) {
        const updatePayload: SongPayload & { '@key': string } = {
          '@assetType': 'song',
          '@key': song['@key'],
          name: formData.name,
          album: {
            '@assetType': 'album',
            '@key': formData.albumKey,
          },
        };
        await api.updateAsset(updatePayload);
        toast.success('Música atualizada com sucesso!');
      } else {
        const createPayload: SongPayload = {
          '@assetType': 'song',
          name: formData.name,
          album: {
            '@assetType': 'album',
            '@key': formData.albumKey,
          },
        };
        await api.createAsset(createPayload);
        toast.success('Música criada com sucesso!');
      }
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(song ? 'Erro ao atualizar música' : 'Erro ao criar música', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Input
          placeholder='Nome da Música'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Select
          value={formData.albumKey}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, albumKey: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o álbum' />
          </SelectTrigger>
          <SelectContent>
            {albums.map((album) => (
              <SelectItem key={album['@key']} value={album['@key']}>
                {album.name} - {getArtistName(album.artist['@key'])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : song ? (
            'Atualizar'
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
