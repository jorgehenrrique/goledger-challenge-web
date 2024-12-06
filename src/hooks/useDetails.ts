import { Album, Artist, Playlist, Song } from '@/types';
import { useState } from 'react';

export default function useDetails() {
  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    song?: Song | null;
    album?: Album | null;
    artist?: Artist | null;
    playlist?: Playlist | null;
  }>({ isOpen: false, playlist: null });

  return { detailsDialog, setDetailsDialog };
}
