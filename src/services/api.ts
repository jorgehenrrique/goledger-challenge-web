import {
  // AssetSchemaResponse,
  // GetSchemaRequest,
  // SchemaResponse,
  BaseAssetPayload,
  CreateAssetRequest,
  DeleteAssetRequest,
  SearchRequest,
  SearchResponse,
  UpdateAssetRequest,
} from '@/types';

const BASE_URL = 'http://ec2-54-91-215-149.compute-1.amazonaws.com/api';

export const api = {
  getHeaders: () => {
    const token = localStorage.getItem('auth-token');
    return {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    };
  },

  // Testar credenciais do usuário para fazer login
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/query/getHeader`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  // Get Schema
  // getSchema: async (): Promise<SchemaResponse[]> => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/query/getSchema`, {
  //       headers: api.getHeaders(),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || `Erro: ${response.status}`);
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error('Erro ao buscar schema:', error);
  //     throw error;
  //   }
  // },

  // Get Asset Schema
  // getAssetSchema: async (assetType: string): Promise<AssetSchemaResponse> => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/query/getSchema`, {
  //       method: 'POST',
  //       headers: api.getHeaders(),
  //       body: JSON.stringify({ assetType } as GetSchemaRequest),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || `Erro: ${response.status}`);
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error(`Erro ao buscar schema do asset ${assetType}:`, error);
  //     throw error;
  //   }
  // },

  // Search Assets
  searchAssets: async <T>(assetType: string): Promise<SearchResponse<T>> => {
    try {
      const searchRequest: SearchRequest = {
        query: {
          selector: {
            '@assetType': assetType,
          },
        },
      };

      const response = await fetch(`${BASE_URL}/query/search`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(searchRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar assets do tipo ${assetType}:`, error);
      throw error;
    }
  },

  // CRUD Operations
  createAsset: async <T extends BaseAssetPayload>(data: T) => {
    try {
      const payload: CreateAssetRequest = {
        asset: [data],
      };

      const response = await fetch(`${BASE_URL}/invoke/createAsset`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      const result = await response.json();
      return result[0];
    } catch (error) {
      console.error('Erro ao criar asset:', error);
      throw error;
    }
  },

  updateAsset: async <T extends BaseAssetPayload & { '@key': string }>(
    data: T
  ) => {
    try {
      const payload: UpdateAssetRequest = {
        update: data,
      };

      const response = await fetch(`${BASE_URL}/invoke/updateAsset`, {
        method: 'PUT',
        headers: api.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar asset:', error);
      throw error;
    }
  },

  deleteAsset: async (assetType: string, key: string) => {
    try {
      const payload: DeleteAssetRequest = {
        key: {
          '@assetType': assetType,
          '@key': key,
        },
      };

      const response = await fetch(`${BASE_URL}/invoke/deleteAsset`, {
        method: 'DELETE',
        headers: api.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao deletar asset ${key}:`, error);
      throw error;
    }
  },
};
