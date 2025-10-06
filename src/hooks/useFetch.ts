import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function useFetch<T>(endpoint: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const refetch = () => setKey(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, key]);

  return { data, loading, error, refetch };
}