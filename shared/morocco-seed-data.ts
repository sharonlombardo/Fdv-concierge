import { ITINERARY_DATA, type DayPage, type FlowItem, type WardrobeExtra } from "./itinerary-data";

export interface MoroccoSeedItem {
  itemId: string;
  itemType: 'look' | 'product' | 'object';
  title: string;
  day: number;
  time: 'Morning' | 'Afternoon' | 'Evening';
  flowTitle: string;
  assetUrl: string | null;
  shopLink: string | null;
  description: string | null;
  isPlaceholder: boolean;
}

function getTimeCategory(time: string): 'Morning' | 'Afternoon' | 'Evening' {
  const lower = time.toLowerCase();
  if (lower.includes('morning')) return 'Morning';
  if (lower.includes('evening')) return 'Evening';
  return 'Afternoon';
}

export function generateMoroccoSeedItems(): MoroccoSeedItem[] {
  const items: MoroccoSeedItem[] = [];
  const placeholderNames = ['Footwear', 'Handbag', 'Jewelry', 'Accessory'];

  const dayPages = ITINERARY_DATA.filter((p): p is DayPage => 'day' in p && typeof p.day === 'number');

  for (const dayPage of dayPages) {
    for (const flow of dayPage.flow) {
      if (!flow.commercialWardrobe) continue;
      
      const timeCategory = getTimeCategory(flow.time);

      items.push({
        itemId: `${flow.id}-look`,
        itemType: 'look',
        title: `${flow.title} - The Look`,
        day: dayPage.day,
        time: timeCategory,
        flowTitle: flow.title,
        assetUrl: flow.commercialWardrobe,
        shopLink: null,
        description: flow.wardrobe || null,
        isPlaceholder: false,
      });

      for (let i = 0; i < 4; i++) {
        const extra = flow.wardrobeExtras?.[i];
        if (extra && extra.image) {
          items.push({
            itemId: extra.id,
            itemType: 'object',
            title: extra.name,
            day: dayPage.day,
            time: timeCategory,
            flowTitle: flow.title,
            assetUrl: extra.image,
            shopLink: extra.shopLink || null,
            description: null,
            isPlaceholder: false,
          });
        } else {
          items.push({
            itemId: `${flow.id}-extra-${i}`,
            itemType: 'object',
            title: placeholderNames[i],
            day: dayPage.day,
            time: timeCategory,
            flowTitle: flow.title,
            assetUrl: null,
            shopLink: null,
            description: null,
            isPlaceholder: true,
          });
        }
      }
    }
  }

  return items;
}

export const MOROCCO_SEED_ITEM_COUNT = generateMoroccoSeedItems().length;
