import { Album, Artist, Playlist, Song } from '.';

export interface ListProps {
  updateList: boolean;
  setUpdateList: (value: boolean) => void;
}

export interface ArtistFormProps {
  artist?: Artist;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface AlbumFormProps {
  album?: Album;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface SongFormProps {
  song?: Song;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface PlaylistFormProps {
  playlist?: Playlist;
  onSuccess?: () => void;
  onCancel?: () => void;
}
