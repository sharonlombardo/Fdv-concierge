import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { SelfieImage } from '@shared/schema';

export function useSelfies() {
  const queryClient = useQueryClient();

  const { data: selfies = [], isLoading } = useQuery<SelfieImage[]>({
    queryKey: ['/api/selfies'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const addSelfieMutation = useMutation({
    mutationFn: async (data: { name: string; originalUrl: string; processedUrl: string }) => {
      const res = await apiRequest('POST', '/api/selfies', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selfies'] });
    },
  });

  const deleteSelfieMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/selfies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selfies'] });
    },
  });

  const getSelfieById = (id: number): SelfieImage | undefined => {
    return selfies.find(s => s.id === id);
  };

  return {
    selfies,
    isLoading,
    addSelfie: addSelfieMutation.mutate,
    deleteSelfie: deleteSelfieMutation.mutate,
    getSelfieById,
    isAdding: addSelfieMutation.isPending,
    isDeleting: deleteSelfieMutation.isPending,
  };
}
