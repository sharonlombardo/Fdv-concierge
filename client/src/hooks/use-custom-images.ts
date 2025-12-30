import { useQuery } from '@tanstack/react-query';
import type { CustomImage } from '@shared/schema';

export function useCustomImages() {
  const { data: customImages = [], isLoading } = useQuery<CustomImage[]>({
    queryKey: ['/api/images'],
  });

  const getImageUrl = (key: string, defaultUrl: string): string => {
    const custom = customImages.find(img => img.imageKey === key);
    return custom?.customUrl || defaultUrl;
  };

  const hasCustomImage = (key: string): boolean => {
    return customImages.some(img => img.imageKey === key);
  };

  return {
    customImages,
    isLoading,
    getImageUrl,
    hasCustomImage,
  };
}
