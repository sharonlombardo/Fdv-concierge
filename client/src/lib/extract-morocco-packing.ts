import {
  ITINERARY_DATA,
  type DayPage,
  type FlowItem
} from './itinerary-data';
import { getProductByKey, SECTION_LOOK_GENOME_KEY } from './brand-genome';

export interface PackingSeedItem {
  itemId: string;
  itemType: 'look' | 'product' | 'object';
  title: string;
  assetUrl: string;
  day: number;
  time: string;
  flowTitle: string;
  aestheticTags?: string[];
  metadata?: {
    description?: string;
    shopLink?: string;
    isLook?: boolean;
    extraIndex?: number;
    isPlaceholder?: boolean;
  };
}

function getTimeCategory(time: string): 'Morning' | 'Afternoon' | 'Evening' {
  const lower = time.toLowerCase();
  if (lower.includes('morning') || (lower.match(/\d/) && parseInt(lower) < 12)) return 'Morning';
  if (lower.includes('evening') || lower.includes('night')) return 'Evening';
  return 'Afternoon';
}

export function extractMoroccoPackingItems(includeEmptySlots = true): PackingSeedItem[] {
  const items: PackingSeedItem[] = [];

  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      
      dayPage.flow.forEach((flow: FlowItem) => {
        if (!flow.commercialWardrobe) return;
        
        const timeCategory = getTimeCategory(flow.time);
        
        const packGenomeKey = SECTION_LOOK_GENOME_KEY[flow.id];
        const packProduct = packGenomeKey ? getProductByKey(packGenomeKey) : undefined;
        items.push({
          itemId: `${flow.id}-look`,
          itemType: 'look',
          title: packProduct?.name || `${flow.title} - The Look`,
          assetUrl: flow.commercialWardrobe,
          day: dayPage.day,
          time: timeCategory,
          flowTitle: flow.title,
          aestheticTags: ['look', 'outfit', 'style', 'morocco'],
          metadata: {
            description: packProduct?.description || flow.wardrobe,
            isLook: true
          }
        });

        const placeholderNames = ['Footwear', 'Handbag', 'Jewelry', 'Accessory'];
        for (let i = 0; i < 4; i++) {
          const extra = flow.wardrobeExtras?.[i];
          const extraKey = `${flow.id}-extra-${i}`;
          
          if (extra?.image) {
            items.push({
              itemId: extraKey,
              itemType: extra.shopLink ? 'product' : 'object',
              title: extra.name,
              assetUrl: extra.image,
              day: dayPage.day,
              time: timeCategory,
              flowTitle: flow.title,
              aestheticTags: ['accessory', placeholderNames[i].toLowerCase(), 'morocco'],
              metadata: {
                shopLink: extra.shopLink,
                isLook: false,
                extraIndex: i
              }
            });
          } else if (includeEmptySlots) {
            items.push({
              itemId: extraKey,
              itemType: 'object',
              title: placeholderNames[i],
              assetUrl: '',
              day: dayPage.day,
              time: timeCategory,
              flowTitle: flow.title,
              aestheticTags: ['accessory', placeholderNames[i].toLowerCase(), 'morocco'],
              metadata: {
                isLook: false,
                extraIndex: i,
                isPlaceholder: true
              }
            });
          }
        }
      });
    }
  });

  return items;
}

export function getMoroccoPackingItemCount(): number {
  return extractMoroccoPackingItems().length;
}
