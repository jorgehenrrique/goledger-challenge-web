'use client';

import { useState, useCallback, useRef } from 'react';
import { Album, Artist, Song } from '@/types';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface BasicData {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  fetchData: () => Promise<void>;
}

export function useBasicData(onUpdateComplete?: () => void): BasicData {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usar useRef para manter a referência estável da callback
  const onUpdateCompleteRef = useRef(onUpdateComplete);
  onUpdateCompleteRef.current = onUpdateComplete;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [songsResponse, albumsResponse, artistsResponse] =
        await Promise.all([
          api.searchAssets<Song>('song'),
          api.searchAssets<Album>('album'),
          api.searchAssets<Artist>('artist'),
        ]);

      setSongs(songsResponse.result);
      setAlbums(albumsResponse.result);
      setArtists(artistsResponse.result);
    } catch (error: unknown) {
      toast.error('Erro ao carregar dados', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
      onUpdateCompleteRef.current?.();
    }
  }, []);

  return { songs, albums, artists, isLoading, setIsLoading, fetchData };
}
