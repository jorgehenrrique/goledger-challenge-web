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
