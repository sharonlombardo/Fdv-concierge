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
