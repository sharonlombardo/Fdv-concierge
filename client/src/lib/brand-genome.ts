/**
 * Brand Genome Utility
 * Provides lookup functions for the FDV product catalog (81 products).
 * Products are keyed by `database_match_key` which is the image filename.
 */

import brandGenomeData from "@/data/fdv_brand_genome.json";
import productMapData from "@/data/morocco_itinerary_product_map.json";

export type BrandGenomeProduct = {
  database_match_key: string;
  category: string;
  brand: string;
  name: string;
  color: string;
  sizes: string[];
  price: string;
  price_numeric: number;
  description: string;
  url: string;
  shop_status: "live" | "coming_soon";
  wellspring_atelier_codes: string[];
};

export type ProductMapSlot = {
  look: string | null;
  footwear: string | null;
  handbag: string | null;
  jewelry: string | null;
  accessory: string | null;
  _note?: string;
  _look_note?: string;
};

export type ProductMapDay = {
  day: number;
  slots: {
    morning: ProductMapSlot | null;
    afternoon: ProductMapSlot | null;
    evening: ProductMapSlot | null;
  };
};

// The JSON is a flat array of products (not wrapped in { products: [...] })
const allProductsList = (Array.isArray(brandGenomeData) ? brandGenomeData : (brandGenomeData as any).products || []) as BrandGenomeProduct[];

// Build lookup map from genome
const genomeMap = new Map<string, BrandGenomeProduct>();
for (const product of allProductsList) {
  genomeMap.set(product.database_match_key, product);
}

// Also build a case-insensitive lookup for robustness
const genomeMapLower = new Map<string, BrandGenomeProduct>();
for (const product of allProductsList) {
  genomeMapLower.set(product.database_match_key.toLowerCase(), product);
}

/**
 * Look up a product by its database_match_key (image filename).
 * Falls back to: case-insensitive match → alias lookup → manual fallback.
 */
export function getProductByKey(key: string): BrandGenomeProduct | undefined {
  // 1. Direct match
  const direct = genomeMap.get(key) || genomeMapLower.get(key.toLowerCase());
  if (direct) return direct;

  // 2. Alias lookup — itinerary keys that don't exactly match genome keys
  const aliasKey = ITINERARY_KEY_ALIAS[key] || ITINERARY_KEY_ALIAS[key.toLowerCase()];
  if (aliasKey) {
    const aliased = genomeMap.get(aliasKey) || genomeMapLower.get(aliasKey.toLowerCase());
    if (aliased) return aliased;
  }

  // 3. Manual fallback — products with no genome entry
  const manual = MANUAL_FALLBACK[key] || MANUAL_FALLBACK[key.toLowerCase()];
  if (manual) {
    return {
      database_match_key: key,
      category: "look",
      brand: manual.brand,
      name: manual.name,
      color: "",
      sizes: [],
      price: "",
      price_numeric: 0,
      description: "",
      url: "",
      shop_status: "coming_soon",
      wellspring_atelier_codes: [],
    } as BrandGenomeProduct;
  }

  return undefined;
}

/**
 * Get all products from the brand genome.
 */
export function getAllProducts(): BrandGenomeProduct[] {
  return allProductsList;
}

/**
 * Get products by category.
 */
export function getProductsByCategory(category: string): BrandGenomeProduct[] {
  return getAllProducts().filter(p => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get the Morocco itinerary product map days.
 */
export function getProductMapDays(): ProductMapDay[] {
  return (productMapData as any).days as ProductMapDay[];
}

/**
 * Get all products for a specific day and time slot from the product map.
 * Returns an array of { position, product } where product may be undefined if not in genome.
 */
export function getSlotProducts(day: number, timeOfDay: "morning" | "afternoon" | "evening"): Array<{
  position: string;
  key: string | null;
  product: BrandGenomeProduct | undefined;
}> {
  const days = getProductMapDays();
  const dayData = days.find(d => d.day === day);
  if (!dayData) return [];

  const slot = dayData.slots[timeOfDay];
  if (!slot) return [];

  const positions: Array<"look" | "footwear" | "handbag" | "jewelry" | "accessory"> =
    ["look", "footwear", "handbag", "jewelry", "accessory"];

  return positions.map(pos => ({
    position: pos,
    key: slot[pos],
    product: slot[pos] ? getProductByKey(slot[pos]!) : undefined,
  }));
}

/**
 * Get a formatted display name for a product (Brand + Name).
 */
export function getProductDisplayName(product: BrandGenomeProduct): string {
  return `${product.brand} ${product.name}`;
}

/**
 * Check if a product is shoppable (has a live shop URL).
 */
export function isShoppable(product: BrandGenomeProduct): boolean {
  return product.shop_status === "live" && !!product.url;
}

/**
 * ITINERARY FLOW ID → GENOME DATABASE_MATCH_KEY
 * Maps ALL product types (looks, footwear, bags, jewelry, accessories, beauty).
 * Format: "d{day}-{slot_index}" — sequential across all time slots for that day.
 */
export const SECTION_LOOK_GENOME_KEY: Record<string, string> = {
  // === DAY 1 ===
  // Morning
  "d1-1": "LOOK:FDV:PHILOMENACAFTAN:SAND.jpg",
  "d1-2": "FOOTWEAR:KHAITE:OTTO:WHT.jpg",
  "d1-3": "access:bag:bottega:hobo.jpg",
  "d1-4": "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
  "d1-5": "ACCESSORY:SUNGLASSES:PHOEBEPHILO:CRUISESUNGLASSES:TAWNY.jpg",
  // Afternoon
  "d1-6": "LOOK:FDV:CYBELBLOUSE:STRIPE.jpg",
  "d1-7": "FOOTWEAR:KHAITE:OTTO:WHT.jpg",
  "d1-8": "access:bag:bottega:hobo.jpg",
  "d1-9": "BEAUTY:FDV:PARFUM.jpg",
  // Evening
  "d1-10": "LOOK:FDV:VIRGINIADRESS:EMERALD.jpg",
  "d1-11": "footwear, amery kit sandal.jpg",
  "d1-12": "ACCESS:BAG:CHLOE:WRISTLETTE:BLACK.jpg",
  "d1-13": "ACCESSORY:JEWELRY:BULGARI:CABACHON NECKLACE.jpg",
  "d1-14": "access:jewlery:phoebephilo:hoops.jpg",
  // === DAY 2 ===
  // Morning
  "d2-1": "LOOK:FDV:JUNOBLOUSE:MARRAKECHPANT:STRIPE.jpg",
  "d2-2": "footwear, amery kit sandal.jpg",
  "d2-3": "ACCESSORY:BAG:DEMELIER:SANTORINI.jpg",
  "d2-5": "ACCESSORY:SUNGLASSES:PHOEBEPHILO:CRUISESUNGLASSES:TAWNY.jpg",
  // Afternoon
  "d2-4": "LOOK:FDV:DIANADRES:STRIPE.jpg",
  "d2-6": "ACCESS:BAG:TOWEL:FDV:POOLESSENTIALS:OLIVE.jpg",
  "d2-7": "access:jewlery:phoebephilo:hoops.jpg",
  "d2-8": "BEAUTY:FDV:TRAVELMIST.jpg",
  // Evening
  "d2-9": "LOOK:FDV:HONORADRESS:FLORAL.jpg",
  "d2-10": "footwear, amery kit sandal.jpg",
  "d2-11": "ACCESS:BAG:CHLOE:WRISTLETTE:BLACK.jpg",
  "d2-12": "phoebe philo earrings dropped.jpg",
  "d2-13": "BEAUTY:VIOLETTEFR:NECATRLIPSTAIN.jpg",
  // === DAY 3 ===
  "d3-1": "LOOK:FDV:BELLACAFTANMINI:IVORY.jpg",
  "d3-2": "footwear, amery kit sandal.jpg",
  "d3-3": "ACCESSORY:BAG:DEMELIER:SANTORINI.jpg",
  "d3-4": "access:jewlery:phoebephilo:hoops.jpg",
  "d3-5": "ACCESS:SUGNLASSES:LOEWE:BLACK.jpg",
  "d3-6": "LOOK:FDV:LUCINABLOUSE:BLACK.jpg",
  "d3-7": "footwear, amery kit sandal.jpg",
  "d3-8": "access:bag:bottega:hobo.jpg",
  "d3-9": "phoebe philo hallmark earrings.jpg",
  "d3-10": "beauty sandwich serum.jpg",
  "d3-11": "LOOK:FDV:CALYPSODRESS:BLACK.jpg",
  "d3-12": "FOOTWEAR:ALAIA:BLACK.jpg",
  "d3-13": "paco rabanne pailette bag.jpg",
  "d3-14": "phoebe philo earrings dropped.jpg",
  "d3-15": "immortelle oil.jpg",
  // === DAY 4 ===
  "d4-1": "LOOK:FDV:LILLITHCAFTAN:IVORY.jpg",
  "d4-2": "footwear, amery kit sandal.jpg",
  "d4-3": "access:bag:bottega:hobo.jpg",
  "d4-4": "le prunier sunscreen.jpg",
  "d4-5": "LOOK:FDV:JUNOBLOUSE:BLK.jpg",
  "d4-6": "footwear, amery kit sandal.jpg",
  "d4-7": "ACCESSORY:BAG:DEMELIER:SANTORINI.jpg",
  "d4-8": "access:jewlery:phoebephilo:hoops.jpg",
  "d4-9": "BEAUTY:RITUELGEINSHA.jpg",
  "d4-10": "LOOK:FDV:ISADORADRESS:BLK.jpg",
  "d4-11": "FOOTWEAR:ALAIA:BLACK.jpg",
  "d4-12": "ACCESSORY:BAG:DRIESVANNOTEN:BLACK.jpg",
  "d4-13": "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
  "d4-14": "BEAUTY:POPPYKING:SINLIPSTICK:RED.jpg",
  // === DAY 5 ===
  "d5-1": "LOOK:FDV:JUNOBLOUSE:STRIPE.jpg",
  "d5-2": "footwear, amery kit sandal.jpg",
  "d5-3": "ACCESSORY:BAG:DEMELIER:SANTORINI.jpg",
  "d5-4": "ACCESS:SUGNLASSES:LOEWE:BLACK.jpg",
  "d5-5": "BEAUTY:SAINJANE:SUNRITUAL.jpg",
  "d5-6": "look:fdv:crepesilkset:black.jpg",
  "d5-7": "FOOTWEAR:ALAIA:BLACK.jpg",
  "d5-8": "ACCESSORY:BAG:BOTTEGA:KALIMERO:BLACK.jpg",
  "d5-9": "phoebe philo earrings dropped.jpg",
  "d5-10": "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
  // === DAY 6 ===
  "d6-1": "LOOK:FDV:LUCINABLOUSE:BLACK.jpg",
  "d6-2": "footwear, amery kit sandal.jpg",
  "d6-3": "access:bag:bottega:hobo.jpg",
  "d6-4": "ACCESSORY:JEWELRY:BULGARI:CABACHON NECKLACE.jpg",
  "d6-5": "ACCESSORY:SUNGLASSES:PHOEBEPHILO:CRUISESUNGLASSES:TAWNY.jpg",
  "d6-6": "LOOK:FDV:CALYPSODRESS:BLACK.jpg",
  "d6-7": "footwear, amery kit sandal.jpg",
  "d6-8": "access:bag:bottega:hobo.jpg",
  "d6-9": "ACCESSORY:JEWELRY:BULGARI:CABACHON NECKLACE.jpg",
  "d6-10": "ACCESSORY:SUNGLASSES:PHOEBEPHILO:CRUISESUNGLASSES:TAWNY.jpg",
  "d6-11": "LOOK:FDV:STEVIECAFTAN:BLACK.jpg",
  "d6-12": "footwear, amery kit sandal.jpg",
  "d6-13": "ACCESS:BAG:CHLOE:WRISTLETTE:BLACK.jpg",
  "d6-14": "phoebe philo earrings dropped.jpg",
  "d6-15": "BEAUTY:AMANESSENTIALS:JADESET.jpg",
  // === DAY 7 ===
  "d7-1": "LOOK:FDV:HONORADRESS:FLORAL.jpg",
  "d7-2": "footwear, amery kit sandal.jpg",
  "d7-3": "access:bag:bottega:hobo.jpg",
  "d7-4": "ACCESSORY:JEWELRY:BULGARI:CABACHON NECKLACE.jpg",
  "d7-5": "ACCESS:SUGNLASSES:LOEWE:BLACK.jpg",
  "d7-6": "LOOK:FDV:ASTRIDBLOUSE:BLK.jpg",
  "d7-7": "FOOTWEAR:FERRAGAMO:LOLYSANDAL:BLACK.jpg",
  "d7-8": "access:bag:bottega:hobo.jpg",
  "d7-9": "access:jewlery:phoebephilo:hoops.jpg",
  "d7-10": "ACCESSORY:GABRIELLAHEARST:WELFATCHASHMERE:SAND.jpg",
  // === DAY 8 ===
  "d8-1": "LOOK:FDV:ATLASSCARF:IVORY.jpg",
  "d8-2": "FOOTWEAR:KHAITE:OTTO:WHT.jpg",
  "d8-3": "access:bag:bottega:hobo.jpg",
  "d8-4": "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
  "d8-5": "BEAUTY:FDV:PARFUM.jpg",
};

/**
 * Alias map for itinerary keys that don't exactly match genome database_match_key values.
 * Maps the itinerary key to the correct genome entry.
 */
export const ITINERARY_KEY_ALIAS: Record<string, string> = {
  "access:bag:bottega:hobo.jpg": "feb 26 prod info pg 1.jpg - Item 5",
  "access:jewlery:phoebephilo:hoops.jpg": "feb 26 prod info pg 1.jpg - Item 6",
  "beauty sandwich serum.jpg": "feb 26 pro info pg 66.jpg - Item 2",
  "immortelle oil.jpg": "beauty:imortelle oil.jpg",
  "paco rabanne pailette bag.jpg": "feb 26 prod info pg 1.jpg - Item 1",
  "phoebe philo earrings dropped.jpg": "feb 26 prod info pg 1.jpg - Item 2",
  "phoebe philo hallmark earrings.jpg": "feb 26 pro info pg 66.jpg - Item 1",
};

/**
 * Manual fallback for products with no genome entry at all.
 * Returns minimal product info for display.
 */
export const MANUAL_FALLBACK: Record<string, { brand: string; name: string }> = {
  "le prunier sunscreen.jpg": { brand: "Le Prunier", name: "Plum Beauty Oil SPF" },
  "look:fdv:crepesilkset:black.jpg": { brand: "FIL DE VIE", name: "Crepe Silk Set" },
};

/** Placeholder image for products without photos */
const PRODUCT_PLACEHOLDER = "/product-placeholder.svg";

/** Vercel Blob base URL for wardrobe images */
const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";

/** Reverse lookup: genome database_match_key → flow ID for wardrobe image resolution */
/** Keeps FIRST occurrence only when same genome key maps to multiple flow IDs */
const GENOME_KEY_TO_FLOW = new Map<string, string>();
for (const [flowId, genomeKey] of Object.entries(SECTION_LOOK_GENOME_KEY)) {
  const normalizedKey = genomeKey.toLowerCase();
  if (!GENOME_KEY_TO_FLOW.has(normalizedKey)) {
    GENOME_KEY_TO_FLOW.set(normalizedKey, flowId);
  }
}
// Also add alias keys → their resolved genome key's flow ID
for (const [aliasKey, realKey] of Object.entries(ITINERARY_KEY_ALIAS)) {
  const normalizedAlias = aliasKey.toLowerCase();
  if (!GENOME_KEY_TO_FLOW.has(normalizedAlias)) {
    // Find if the real key has a flow mapping
    const realFlow = GENOME_KEY_TO_FLOW.get(realKey.toLowerCase());
    if (realFlow) {
      GENOME_KEY_TO_FLOW.set(normalizedAlias, realFlow);
    }
  }
}

/**
 * Get the best available image URL for a genome product.
 * For look items: resolves genome key → flow ID → Blob wardrobe image.
 * For accessories: uses fallbackFlowId to get the parent slot's wardrobe image.
 * Returns placeholder SVG only as last resort.
 */
export function getProductImageUrl(genomeKey: string, fallbackFlowId?: string): string {
  // First try direct genome key → flow ID mapping (for look items)
  const flowId = GENOME_KEY_TO_FLOW.get(genomeKey.toLowerCase());
  if (flowId) {
    return `${BLOB_BASE}/${flowId}-wardrobe`;
  }
  // For accessories: use the parent slot's wardrobe image
  if (fallbackFlowId) {
    return `${BLOB_BASE}/${fallbackFlowId}-wardrobe`;
  }
  return PRODUCT_PLACEHOLDER;
}

/**
 * Find a product by partial key match (case-insensitive).
 * Tries exact match first, then checks if either key contains the other.
 */
export function findProductByPartialKey(partialKey: string): BrandGenomeProduct | undefined {
  if (!partialKey) return undefined;
  const normalized = partialKey.toLowerCase().trim();
  // Try exact case-insensitive match first
  const exact = genomeMapLower.get(normalized);
  if (exact) return exact;
  // Try partial match — check if either contains the other
  for (const product of allProductsList) {
    const dbKey = product.database_match_key.toLowerCase().trim();
    if (dbKey.includes(normalized) || normalized.includes(dbKey)) {
      return product;
    }
  }
  return undefined;
}
