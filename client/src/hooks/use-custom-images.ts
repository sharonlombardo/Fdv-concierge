import { useQuery } from '@tanstack/react-query';
import type { CustomImage, ImageLibraryItem, ImageRule } from '@shared/schema';

interface ItemContext {
  time?: string;
  location?: string;
  title?: string;
  description?: string;
  imageType?: 'item' | 'wardrobe' | 'cover';
}

// Normalize time strings like "07:30", "Morning", "09:00 – 11:00" to buckets
function normalizeTimeToCategory(timeStr: string): string[] {
  const lower = timeStr.toLowerCase();
  const categories: string[] = [];
  
  // Direct matches for labels
  if (lower.includes('morning')) categories.push('morning');
  if (lower.includes('afternoon')) categories.push('afternoon');
  if (lower.includes('evening')) categories.push('evening');
  if (lower.includes('night')) categories.push('night');
  
  // Parse numeric times
  const timeMatch = lower.match(/(\d{1,2}):?(\d{2})?/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    if (hour >= 5 && hour < 12) categories.push('morning');
    else if (hour >= 12 && hour < 17) categories.push('afternoon');
    else if (hour >= 17 && hour < 21) categories.push('evening');
    else categories.push('night');
  }
  
  return categories.length > 0 ? categories : ['morning'];
}

export function useCustomImages() {
  const { data: customImages = [], isLoading: isLoadingCustom } = useQuery<CustomImage[]>({
    queryKey: ['/api/images'],
    staleTime: 0, // Always refetch to prevent stale cached images
    refetchOnMount: 'always',
  });

  const { data: libraryImages = [], isLoading: isLoadingLibrary } = useQuery<ImageLibraryItem[]>({
    queryKey: ['/api/library'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: rules = [], isLoading: isLoadingRules } = useQuery<ImageRule[]>({
    queryKey: ['/api/rules'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const isLoading = isLoadingCustom || isLoadingLibrary || isLoadingRules;

  const findMatchingRule = (context: ItemContext): ImageRule | null => {
    const enabledRules = rules.filter(r => r.enabled === 1);
    const sortedRules = [...enabledRules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    for (const rule of sortedRules) {
      if (context.imageType && rule.imageType !== context.imageType) {
        continue;
      }

      let matches = true;

      if (rule.matchTime && rule.matchTime.length > 0 && context.time) {
        const timeCategories = normalizeTimeToCategory(context.time);
        const timeMatches = rule.matchTime.some(t => timeCategories.includes(t.toLowerCase()));
        if (!timeMatches) matches = false;
      }

      if (matches && rule.matchLocation && rule.matchLocation.length > 0 && context.location) {
        const contextLoc = context.location.toLowerCase();
        const locMatches = rule.matchLocation.some(l => contextLoc.includes(l.toLowerCase()));
        if (!locMatches) matches = false;
      }

      if (matches && rule.matchKeywords && rule.matchKeywords.length > 0) {
        const searchText = `${context.title || ''} ${context.description || ''}`.toLowerCase();
        const keywordMatches = rule.matchKeywords.some(k => searchText.includes(k.toLowerCase()));
        if (!keywordMatches) matches = false;
      }

      if (matches) {
        return rule;
      }
    }

    return null;
  };

  const findLibraryImage = (tags: string[]): ImageLibraryItem | null => {
    if (tags.length === 0) return null;

    const matchingImages = libraryImages.filter(img =>
      tags.some(tag => img.tags?.includes(tag))
    );

    if (matchingImages.length === 0) return null;

    const sorted = [...matchingImages].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return sorted[0];
  };

  const getImageUrl = (key: string, defaultUrl: string, context?: ItemContext): string => {
    const custom = customImages.find(img => img.imageKey === key);
    if (custom?.customUrl) {
      return custom.customUrl;
    }

    if (context) {
      const matchingRule = findMatchingRule(context);
      if (matchingRule && matchingRule.assignTags) {
        const libraryImage = findLibraryImage(matchingRule.assignTags);
        if (libraryImage) {
          return libraryImage.imageUrl;
        }
      }
    }

    return defaultUrl;
  };

  const hasCustomImage = (key: string): boolean => {
    return customImages.some(img => img.imageKey === key);
  };

  const hasRuleMatch = (context: ItemContext): boolean => {
    const rule = findMatchingRule(context);
    if (rule && rule.assignTags) {
      const libraryImage = findLibraryImage(rule.assignTags);
      return !!libraryImage;
    }
    return false;
  };

  return {
    customImages,
    libraryImages,
    rules,
    isLoading,
    getImageUrl,
    hasCustomImage,
    hasRuleMatch,
  };
}
