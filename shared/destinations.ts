export interface Destination {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  imageSlotKey: string;
  defaultImage: string;
  route: string;
  available: boolean;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "morocco",
    title: "Morocco",
    subtitle: "April 2026",
    summary: "A curated journey through Marrakech, the Atlas Mountains, and Essaouira",
    imageSlotKey: "destination-morocco",
    defaultImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    route: "/guides/morocco",
    available: true
  },
  {
    slug: "hydra",
    title: "Hydra",
    subtitle: "Coming Soon",
    summary: "Stone, water, and stillness on a car-free Greek island",
    imageSlotKey: "destination-hydra",
    defaultImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/hydra",
    available: false
  },
  {
    slug: "slow-travel",
    title: "Slow Travel",
    subtitle: "Philosophy",
    summary: "Less, but longer. The art of staying somewhere long enough to belong",
    imageSlotKey: "destination-slow-travel",
    defaultImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/slow-travel",
    available: false
  },
  {
    slug: "retreat",
    title: "Ritual Retreat",
    subtitle: "Coming Soon",
    summary: "Movement, then stillness. Places designed for practice and presence",
    imageSlotKey: "destination-retreat",
    defaultImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/retreat",
    available: false
  },
  {
    slug: "new-york",
    title: "New York",
    subtitle: "Coming Soon",
    summary: "The weekend that holds. Culture, food, and a different kind of pace",
    imageSlotKey: "destination-new-york",
    defaultImage: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200",
    route: "/coming-soon/new-york",
    available: false
  }
];
