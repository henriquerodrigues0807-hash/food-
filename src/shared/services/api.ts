/**
 * Shared API Service Wrapper
 */

const BASE_URL = '/api'; // Mock base URL, can be changed later

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const api = {
  get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = new URL(endpoint, window.location.origin + BASE_URL);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  post: async <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> => {
    const url = new URL(endpoint, window.location.origin + BASE_URL);
    
    const response = await fetch(url.toString(), {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  put: async <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> => {
    const url = new URL(endpoint, window.location.origin + BASE_URL);
    
    const response = await fetch(url.toString(), {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  delete: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = new URL(endpoint, window.location.origin + BASE_URL);
    
    const response = await fetch(url.toString(), {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};

export default api;
