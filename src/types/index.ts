// Tipos para getSchema
export interface SchemaResponse {
  description: string;
  dynamic: boolean;
  label: string;
  tag: string;
  writers: null;
}

// Tipos para getSchema específico (artist, album, etc)
interface SchemaProp {
  dataType: string;
  description: string;
  isKey: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
  tag: string;
  writers: null;
}

export interface AssetSchemaResponse {
  description: string;
  label: string;
  props: SchemaProp[];
  tag: string;
}

// Tipos base para assets
interface BaseAsset {
  '@assetType': string;
  '@key': string;
  '@lastTouchBy': string;
  '@lastTx': string;
  '@lastUpdated': string;
}

// Artist
export interface Artist extends BaseAsset {
  '@assetType': 'artist';
  name: string;
  country: string;
}

// Album
export interface Album extends BaseAsset {
  '@assetType': 'album';
  name: string;
  artist: {
    '@assetType': 'artist';
    '@key': string;
  };
  year: number;
}

// Song
export interface Song extends BaseAsset {
  '@assetType': 'song';
  name: string;
  album: {
    '@assetType': 'album';
    '@key': string;
  };
}

// Playlist
export interface Playlist extends BaseAsset {
  '@assetType': 'playlist';
  name: string;
  songs: Array<{
    '@assetType': 'song';
    '@key': string;
  }>;
  private: boolean;
}

// Tipos para respostas da API
export interface SearchResponse<T> {
  metadata: null;
  result: T[];
}

// Tipos para requisições
export interface SearchRequest {
  query: {
    selector: {
      '@assetType': string;
    };
  };
}

export interface GetSchemaRequest {
  assetType: string;
}

// Tipo base para todos os assets
export interface BaseAssetPayload {
  '@assetType': string;
}

// Tipos para CRUD
export interface CreateAssetRequest {
  asset: Array<{
    '@assetType': string;
  }>;
}

export interface UpdateAssetRequest {
  update: {
    '@assetType': string;
    '@key': string;
  };
}

export interface DeleteAssetRequest {
  key: {
    '@assetType': string;
    '@key': string;
  };
}

// Tipos específicos para cada asset
export interface ArtistPayload {
  '@assetType': 'artist';
  name: string;
  country: string;
}

export interface AlbumPayload {
  '@assetType': 'album';
  name: string;
  artist: {
    '@assetType': 'artist';
    '@key': string;
  };
  year: number;
}

export interface SongPayload {
  '@assetType': 'song';
  name: string;
  album: {
    '@assetType': 'album';
    '@key': string;
  };
}

export interface PlaylistPayload {
  '@assetType': 'playlist';
  name: string;
  songs: Array<{
    '@assetType': 'song';
    '@key': string;
  }>;
  private: boolean;
}
