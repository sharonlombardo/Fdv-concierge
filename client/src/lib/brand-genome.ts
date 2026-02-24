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
 * Falls back to case-insensitive match.
 */
export function getProductByKey(key: string): BrandGenomeProduct | undefined {
  return genomeMap.get(key) || genomeMapLower.get(key.toLowerCase());
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
 * Hardcoded map: flow.id → genome database_match_key for the "look" image.
 * Source of truth: morocco_itinerary_product_map.json "look" entries per day/slot.
 */
export const SECTION_LOOK_GENOME_KEY: Record<string, string> = {
  // Day 1
  "d1-1": "LOOK:FDV:PHILOMENACAFTAN:SAND.jpg",
  "d1-3": "LOOK:FDV:CYBELBLOUSE:STRIPE.jpg",
  "d1-6": "LOOK:FDV:VIRGINIADRESS:EMERALD.jpg",
  // Day 2
  "d2-1": "LOOK:FDV:JUNOBLOUSE:MARRAKECHPANT:STRIPE.jpg",
  "d2-4": "LOOK:FDV:DIANADRES:STRIPE.jpg",
  "d2-7": "LOOK:FDV:HONORADRESS:FLORAL.jpg",
  // Day 3
  "d3-1": "LOOK:FDV:BELLACAFTANMINI:IVORY.jpg",
  "d3-5": "LOOK:FDV:LUCINABLOUSE:BLACK.jpg",
  "d3-9": "LOOK:FDV:CALYPSODRESS:BLACK.jpg",
  // Day 4
  "d4-1": "LOOK:FDV:LILLITHCAFTAN:IVORY.jpg",
  "d4-4": "LOOK:FDV:JUNOBLOUSE:BLK.jpg",
  "d4-9": "LOOK:FDV:ISADORADRESS:BLK.jpg",
  // Day 5
  "d5-1": "LOOK:FDV:JUNOBLOUSE:STRIPE.jpg",
  "d5-3": "LOOK:FDV:JUNOBLOUSE:STRIPE.jpg",
  "d5-7": "look:fdv:crepesilkset:black.jpg",
  // Day 6
  "d6-1": "LOOK:FDV:LUCINABLOUSE:BLACK.jpg",
  "d6-4": "LOOK:FDV:CALYPSODRESS:BLACK.jpg",
  "d6-8": "LOOK:FDV:STEVIECAFTAN:BLACK.jpg",
  // Day 7
  "d7-1": "LOOK:FDV:HONORADRESS:FLORAL.jpg",
  "d7-4": "LOOK:FDV:ASTRIDBLOUSE:BLK.jpg",
  // Day 8
  "d8-1": "LOOK:FDV:ATLASSCARF:IVORY.jpg",
  "d8-4": "LOOK:FDV:ATLASSCARF:IVORY.jpg",
};

/** Placeholder image for products without photos */
const PRODUCT_PLACEHOLDER = "/product-placeholder.svg";

/**
 * Get the best available image URL for a genome product.
 * Returns the placeholder SVG since we don't have individual product photos.
 */
export function getProductImageUrl(_genomeKey: string): string {
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
