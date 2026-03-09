export interface CapsuleItem {
  id: string;
  database_match_key: string;
  brand: string;
  name: string;
  price?: string;
  category: string; // "footwear" | "handbag" | "jewelry" | "accessory" | "beauty"
  pinType: string; // "object" for accessories
}

export interface MoodImage {
  imageUrl: string;
  alt: string;
}

export interface Capsule {
  id: string;
  name: string;
  tagline: string;
  editorialCopy: string;
  moodImages: MoodImage[]; // Editorial/lifestyle images — 2-column grid
  accessories: CapsuleItem[]; // Shoes, bags, jewelry, beauty — horizontal scroll
  createdAt: string;
}

const BLOB_BASE =
  "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_IMG = `${BLOB_BASE}/guide-morocco`;

export const PRESET_CAPSULES: Capsule[] = [
  {
    id: "desert-neutrals",
    name: "Desert Neutrals",
    tagline:
      "A curated selection of mood, looks, and pieces for the journey ahead.",
    editorialCopy:
      "We noticed a thread—quiet warmth, natural textures, unhurried beauty. Here's what belongs together.",
    moodImages: [
      {
        imageUrl: `${BLOB_BASE}/todays-edit-mood-1`,
        alt: "Editorial fashion — woman under palm thatch",
      },
      {
        imageUrl: `${BLOB_BASE}/todays-edit-mood-2`,
        alt: "Sunset over Moroccan kasbah",
      },
      {
        imageUrl: `${BLOB_BASE}/todays-edit-mood-3`,
        alt: "Terracotta archway with olive trees",
      },
      {
        imageUrl: `${GUIDE_IMG}/stay-3-large.jpg`,
        alt: "Grand Moroccan archway — warm golden light",
      },
      {
        imageUrl: `${GUIDE_IMG}/stay-1-large.jpg`,
        alt: "Riad pool with loungers",
      },
      {
        imageUrl: `${BLOB_BASE}/todays-edit-mood-4`,
        alt: "Editorial wardrobe — striped outfit in Morocco",
      },
    ],
    accessories: [
      {
        id: "dn-acc-1",
        database_match_key: "FOOTWEAR:KHAITE:OTTO:WHT.jpg",
        brand: "KHAITE",
        name: "Otto Leather Slippers",
        price: "$595",
        category: "footwear",
        pinType: "object",
      },
      {
        id: "dn-acc-2",
        database_match_key: "footwear, amery kit sandal.jpg",
        brand: "A EMERY",
        name: "Kir Sandal",
        price: "$185",
        category: "footwear",
        pinType: "object",
      },
      {
        id: "dn-acc-3",
        database_match_key: "access:bag:bottega:hobo.jpg",
        brand: "BOTTEGA VENETA",
        name: "Solstice Bag",
        price: "$4,200",
        category: "bag",
        pinType: "object",
      },
      {
        id: "dn-acc-4",
        database_match_key: "ACCESSORY:BAG:DEMELIER:SANTORINI.jpg",
        brand: "DEMELLIER",
        name: "Santorini Basket Bag",
        category: "bag",
        pinType: "object",
      },
      {
        id: "dn-acc-5",
        database_match_key: "access:jewlery:phoebephilo:hoops.jpg",
        brand: "PHOEBE PHILO",
        name: "Mini Hoops",
        category: "jewelry",
        pinType: "object",
      },
      {
        id: "dn-acc-6",
        database_match_key: "ACCESSORY:PHOEBEPHILO:PEAKSUNGLASSES:BLACK.jpg",
        brand: "PHOEBE PHILO",
        name: "Peak Sunglasses",
        price: "$490",
        category: "accessory",
        pinType: "object",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "evening-marrakech",
    name: "Evening in Marrakech",
    tagline:
      "A curated selection of mood, looks, and pieces for the journey ahead.",
    editorialCopy:
      "When the sun sets and the city glows. Luminous, intentional, magnetic.",
    moodImages: [
      {
        imageUrl: `${GUIDE_IMG}/exp-4-large.jpg`,
        alt: "Evening ambiance — lantern-lit terrace",
      },
      {
        imageUrl: `${GUIDE_IMG}/eat-1-large.jpg`,
        alt: "Candlelit dining — Marrakech restaurant",
      },
      {
        imageUrl: `${GUIDE_IMG}/stay-3-large.jpg`,
        alt: "Riad evening — pool at dusk",
      },
      {
        imageUrl: `${GUIDE_IMG}/shop-3-large.jpg`,
        alt: "Evening souk — golden hour",
      },
      {
        imageUrl: `${GUIDE_IMG}/eat-3-large.jpg`,
        alt: "Rooftop dining — city lights",
      },
      {
        imageUrl: `${GUIDE_IMG}/ward-2-large_fdv_isadora_dress.jpg`,
        alt: "Editorial wardrobe — evening look",
      },
    ],
    accessories: [
      {
        id: "em-acc-1",
        database_match_key: "FOOTWEAR:ALAIA:BLACK.jpg",
        brand: "ALAÏA",
        name: "Heel Thong Mules",
        price: "$1,450",
        category: "footwear",
        pinType: "object",
      },
      {
        id: "em-acc-2",
        database_match_key: "ACCESS:BAG:CHLOE:WRISTLETTE:BLACK.jpg",
        brand: "CHLOÉ",
        name: "Wristlette",
        price: "$4,200",
        category: "bag",
        pinType: "object",
      },
      {
        id: "em-acc-3",
        database_match_key: "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
        brand: "BULGARI",
        name: "Serpenti Watch",
        price: "$13,200",
        category: "accessory",
        pinType: "object",
      },
      {
        id: "em-acc-4",
        database_match_key: "ACCESSORY:JEWELRY:BULGARI:CABACHON NECKLACE.jpg",
        brand: "BULGARI",
        name: "Cabochon Necklace",
        category: "jewelry",
        pinType: "object",
      },
      {
        id: "em-acc-5",
        database_match_key: "phoebe philo earrings dropped.jpg",
        brand: "PHOEBE PHILO",
        name: "Drop Earrings",
        category: "jewelry",
        pinType: "object",
      },
      {
        id: "em-acc-6",
        database_match_key: "BEAUTY:FDV:PARFUM.jpg",
        brand: "FIL DE VIE",
        name: "Parfum",
        price: "$475",
        category: "beauty",
        pinType: "object",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];
