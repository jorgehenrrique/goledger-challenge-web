'use client';

import { useState, useCallback, useRef } from 'react';
import { Playlist } from '@/types';
import { api } from '@/services/api';
import { useBasicData, BasicData } from './useBasicData';
import { toast } from 'sonner';

export interface ExtendedData extends BasicData {
  playlists: Playlist[];
}

export function useExtendedData(onUpdateComplete?: () => void): ExtendedData {
  const basicData = useBasicData(onUpdateComplete);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Usar useRef para manter a referência estável do basicData.fetchData
  const basicDataRef = useRef(basicData);
  basicDataRef.current = basicData;

  const fetchData = useCallback(async () => {
    try {
      const [playlistsResponse] = await Promise.all([
        api.searchAssets<Playlist>('playlist'),
        basicDataRef.current.fetchData(),
      ]);

      setPlaylists(playlistsResponse.result);
    } catch (error: unknown) {
      toast.error('Erro ao carregar playlists', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }, []);

  return {
    ...basicData,
    playlists,
    fetchData,
  };
}
