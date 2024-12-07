import { Album, Artist, Playlist, Song } from '@/types';
import { useState } from 'react';

export function useDetails() {
  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    song?: Song | null;
    album?: Album | null;
    artist?: Artist | null;
    playlist?: Playlist | null;
  }>({ isOpen: false });

  return { detailsDialog, setDetailsDialog };
}

export function useDialog() {
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    song?: Song | null;
    album?: Album | null;
    artist?: Artist | null;
    playlist?: Playlist | null;
  }>({ isOpen: false });

  return { editDialog, setEditDialog };
}

export function useDelete() {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    artistId?: string | null;
    albumId?: string | null;
    artistName?: string | null;
    albumName?: string | null;
    songId?: string | null;
    songName?: string | null;
    playlistId?: string | null;
    playlistName?: string | null;
  }>({ isOpen: false });

  return { deleteDialog, setDeleteDialog };
}

// States comuns
export function useCommon() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  return {
    currentPage,
    sortOrder,
    search,
    setCurrentPage,
    setSortOrder,
    setSearch,
  };
}
