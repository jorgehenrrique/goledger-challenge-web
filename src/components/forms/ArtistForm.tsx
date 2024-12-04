'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ArtistPayload } from '@/types';
import { ArtistFormProps } from '@/types/props';

export function ArtistForm({ artist, onSuccess, onCancel }: ArtistFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    country: artist?.country || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (artist) {
        const updatePayload: ArtistPayload & { '@key': string } = {
          '@assetType': 'artist',
          '@key': artist['@key'],
          name: formData.name,
          country: formData.country,
        };
        await api.updateAsset(updatePayload);
        toast.success('Artista atualizado com sucesso!');
      } else {
        const createPayload: ArtistPayload = {
          '@assetType': 'artist',
          name: formData.name,
          country: formData.country,
        };
        await api.createAsset(createPayload);
        toast.success('Artista criado com sucesso!');
      }
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        artist ? 'Erro ao atualizar artista' : 'Erro ao criar artista',
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
          placeholder='Nome do Artista'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Input
          placeholder='País'
          value={formData.country}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, country: e.target.value }))
          }
          required
        />
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : artist ? (
            'Atualizar'
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
