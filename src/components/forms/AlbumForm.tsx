'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Artist, AlbumPayload } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect } from 'react';
import { AlbumFormProps } from '@/types/props';

export function AlbumForm({ album, onSuccess, onCancel }: AlbumFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [formData, setFormData] = useState({
    name: album?.name || '',
    artistKey: album?.artist['@key'] || '',
    year: album?.year || new Date().getFullYear(),
  });

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await api.searchAssets<Artist>('artist');
        setArtists(response.result);
      } catch (error) {
        toast.error('Erro ao carregar artistas', {
          description:
            error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }
    fetchArtists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (album) {
        const updatePayload: AlbumPayload & { '@key': string } = {
          '@assetType': 'album',
          '@key': album['@key'],
          name: formData.name,
          artist: {
            '@assetType': 'artist',
            '@key': formData.artistKey,
          },
          year: Number(formData.year),
        };
        await api.updateAsset(updatePayload);
        toast.success('Álbum atualizado com sucesso!');
      } else {
        const createPayload: AlbumPayload = {
          '@assetType': 'album',
          name: formData.name,
          artist: {
            '@assetType': 'artist',
            '@key': formData.artistKey,
          },
          year: Number(formData.year),
        };
        await api.createAsset(createPayload);
        toast.success('Álbum criado com sucesso!');
      }
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(album ? 'Erro ao atualizar álbum' : 'Erro ao criar álbum', {
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
          placeholder='Nome do Álbum'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Select
          value={formData.artistKey}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, artistKey: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o artista' />
          </SelectTrigger>
          <SelectContent>
            {artists.map((artist) => (
              <SelectItem key={artist['@key']} value={artist['@key']}>
                {artist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type='number'
          placeholder='Ano'
          value={formData.year}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))
          }
          required
          min={0}
          max={new Date().getFullYear()}
        />
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : album ? (
            'Atualizar'
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
