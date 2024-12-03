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

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  // Get Schema
  getSchema: async () => {
    try {
      const response = await fetch(`${BASE_URL}/query/getSchema`, {
        headers: api.getHeaders(),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar schema:', error);
      throw error;
    }
  },

  // Get Asset Schema
  getAssetSchema: async (assetType: string) => {
    try {
      const response = await fetch(`${BASE_URL}/query/getSchema`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify({ assetType }),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error(`Erro ao buscar schema do asset ${assetType}:`, error);
      throw error;
    }
  },

  // Search Assets
  searchAssets: async (assetType: string) => {
    try {
      const response = await fetch(`${BASE_URL}/query/search`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify({
          query: {
            selector: {
              '@assetType': assetType,
            },
          },
        }),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error(`Erro ao buscar assets do tipo ${assetType}:`, error);
      throw error;
    }
  },

  // CRUD Operations
  createAsset: async (data: unknown) => {
    try {
      const response = await fetch(`${BASE_URL}/invoke/createAsset`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error('Erro ao criar asset:', error);
      throw error;
    }
  },

  updateAsset: async (data: unknown) => {
    try {
      const response = await fetch(`${BASE_URL}/invoke/updateAsset`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar asset:', error);
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/invoke/deleteAsset`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error(`Erro ao deletar asset ${id}:`, error);
      throw error;
    }
  },
};
