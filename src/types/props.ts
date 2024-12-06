import { Album, Artist, Playlist, Song } from '.';

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface MainLayoutProps extends ChildrenProps {
  showHeader?: boolean;
}

export interface ListProps {
  updateList: boolean;
  setUpdateList: (value: boolean) => void;
}

export interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ArtistFormProps extends FormProps {
  artist?: Artist;
}

export interface AlbumFormProps extends FormProps {
  album?: Album;
}

export interface SongFormProps extends FormProps {
  song?: Song;
}

export interface PlaylistFormProps extends FormProps {
  playlist?: Playlist;
}

// Header
export type ItemType = 'song' | 'album' | 'artist' | 'playlist';

export interface SearchItem {
  id: string;
  name: string;
  type: ItemType;
}
export interface SearchResults {
  songs: SearchItem[];
  albums: SearchItem[];
  artists: SearchItem[];
  playlists: SearchItem[];
}

export type HandleItemClick = (type: ItemType, id: string) => void;
