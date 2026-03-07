export interface CapsuleItem {
  database_match_key: string;
  brand: string;
  name: string;
  price: string;
  category: string; // "look" | "footwear" | "bag" | "jewelry" | "beauty" | "accessory"
}

export interface Capsule {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mood: string;
  items: CapsuleItem[];
  createdAt: string;
}

export const PRESET_CAPSULES: Capsule[] = [
  {
    id: "desert-neutrals",
    name: "Desert Neutrals",
    tagline: "Quiet warmth. Natural textures. Unhurried beauty.",
    description:
      "We noticed a thread — quiet warmth, natural textures, unhurried beauty. Here's what belongs together.",
    mood: "Warm · Grounded · Effortless",
    items: [
      // LOOKS (hero pieces)
      {
        database_match_key: "Look:alia:soukcoat:desertpants:blush.jpg",
        brand: "Alaïa",
        name: "Souk Coat & Desert Pant",
        price: "$1,200 / $760",
        category: "look",
      },
      {
        database_match_key: "LOOK:FDV:PHILOMENACAFTAN:SAND.jpg",
        brand: "FIL DE VIE",
        name: "Philomena Caftan",
        price: "$1,250",
        category: "look",
      },
      {
        database_match_key: "look:fdv:cashmereknitset:ivory.jpg",
        brand: "FIL DE VIE",
        name: "Cashmere Knit Set",
        price: "$2,400",
        category: "look",
      },
      {
        database_match_key: "LOOK:LOROPIANA:SLIPDRESS:BLACK.jpg",
        brand: "Loro Piana",
        name: "Slip Dress",
        price: "$1,300",
        category: "look",
      },
      {
        database_match_key: "look:phoebephilo:cashmereovercoat:tobacco.jpg",
        brand: "Phoebe Philo",
        name: "Cashmere Overcoat",
        price: "$5,900",
        category: "look",
      },
      // FOOTWEAR
      {
        database_match_key: "footwear, amery kit sandal.jpg",
        brand: "A Emery",
        name: "Kir Sandal",
        price: "$185",
        category: "footwear",
      },
      {
        database_match_key: "FOOTWEAR:KHAITE:OTTO:WHT.jpg",
        brand: "Khaite",
        name: "Otto Leather Slippers",
        price: "$595",
        category: "footwear",
      },
      // ACCESSORIES
      {
        database_match_key:
          "ACCESSORY:GABRIELLAHEARST:WELFATCHASHMERE:SAND.jpg",
        brand: "Gabriella Hearst",
        name: "Lauren Knit Wrap",
        price: "$3,170",
        category: "accessory",
      },
      {
        database_match_key: "ACCESS:BAG:CHLOE:WRISTLETTE:BLACK.jpg",
        brand: "Chloé",
        name: "Wristlette",
        price: "$4,200",
        category: "bag",
      },
      // BEAUTY
      {
        database_match_key: "beauty:imortelle oil.jpg",
        brand: "Hildegaard",
        name: "Immortelle Facial Oil",
        price: "$375",
        category: "beauty",
      },
      {
        database_match_key: "BEAUTY:FDV:PARFUM.jpg",
        brand: "FIL DE VIE",
        name: "Parfum",
        price: "$475",
        category: "beauty",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "evening-marrakech",
    name: "Evening in Marrakech",
    tagline: "When the sun sets and the city glows.",
    description:
      "For the hours when Marrakech transforms — when the heat breaks and the light turns gold. Every piece chosen for the woman who arrives already knowing where she's going.",
    mood: "Luminous · Intentional · Magnetic",
    items: [
      // LOOKS
      {
        database_match_key: "LOOK:YSL:JUMPSUIT:BLACK.jpg",
        brand: "YSL",
        name: "Jumpsuit",
        price: "$1,230",
        category: "look",
      },
      {
        database_match_key: "look:phoebephilo:gaiadress:black.jpg",
        brand: "Phoebe Philo",
        name: "Gaia Dress",
        price: "$2,360",
        category: "look",
      },
      {
        database_match_key: "LOOK:DRIESVANNOTEN:LAYEREDSILKDRESS:BLACK.jpg",
        brand: "Dries Van Noten",
        name: "Layered Silk Dress",
        price: "$750",
        category: "look",
      },
      {
        database_match_key: "LOOK:JILSANDER:SILKFLUIDSET:BLACK.jpg",
        brand: "Jil Sander",
        name: "Silk Button Down & Fluid Pant",
        price: "$760 / $720",
        category: "look",
      },
      {
        database_match_key: "LOOK:FDV:ISADORADRESS:BLK.jpg",
        brand: "FIL DE VIE",
        name: "Isadora Dress",
        price: "$795",
        category: "look",
      },
      // FOOTWEAR
      {
        database_match_key: "FOOTWEAR:ALAIA:BLACK.jpg",
        brand: "Alaïa",
        name: "Heel Thong Mules",
        price: "$1,450",
        category: "footwear",
      },
      {
        database_match_key: "FOOTWEAR:PHOEBEPHILO:ANKLEBOOT:BLACK.jpg",
        brand: "Phoebe Philo",
        name: "Ankle Boot",
        price: "$1,650",
        category: "footwear",
      },
      // ACCESSORIES
      {
        database_match_key: "feb 26 prod info pg 1.jpg - Item 1",
        brand: "Paco Rabanne",
        name: "Gold Pailette Handbag",
        price: "$1,490",
        category: "bag",
      },
      {
        database_match_key: "feb 26 prod info pg 1.jpg - Item 2",
        brand: "Phoebe Philo",
        name: "Gold Drop Earrings",
        price: "$1,050",
        category: "jewelry",
      },
      {
        database_match_key: "ACCESSORY:BULGAR:SERPENTI:BLK.jpg",
        brand: "Bulgari",
        name: "Serpenti Watch",
        price: "$13,200",
        category: "accessory",
      },
      // BEAUTY
      {
        database_match_key: "BEAUTY:POPPYKING:SINLIPSTICK:RED.jpg",
        brand: "Poppy King",
        name: "Original Sin Lipstick",
        price: "$34",
        category: "beauty",
      },
      {
        database_match_key: "BEAUTY:VIOLETTEFR:NECATRLIPSTAIN.jpg",
        brand: "Violette_FR",
        name: "Nectar Lip Stain",
        price: "$29",
        category: "beauty",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];
