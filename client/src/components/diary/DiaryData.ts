export interface DiaryPhoto {
  src: string;
  caption: string;
}

export interface DiaryMoment {
  title: string;
  time: string;
  note: string;
}

export interface DiaryWardrobeItem {
  /** Lowercase brand-genome key, resolved via getShopImageUrl at render time. */
  genomeKey?: string;
  /** Optional explicit image URL — wins over genomeKey when both are set. */
  imageUrl?: string;
  /** Color swatch fallback used when no genomeKey/imageUrl is provided. */
  swatch?: string;
  label: string;
  detail: string;
}

export interface DiaryDay {
  n: number;
  date: string;
  day_label: string;
  location: string;
  sub_location: string;
  mantra: string;
  hero: string | null;
  hero_alt: string;
  photos: DiaryPhoto[];
  moments: DiaryMoment[];
  journal: string;
  wardrobe?: DiaryWardrobeItem[];
}

export interface DiaryCover {
  pullquote: string;
  intro: string;
}

export interface DiaryData {
  brand: string;
  destination: string;
  year: string;
  dateline: string;
  traveler: string;
  signature: string;
  tagline: string;
  cover: DiaryCover;
  days: DiaryDay[];
}

const photo = (name: string): string => `/diary/photos/${name}`;

const MOROCCO_GUIDE_IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco';

export const MOROCCO_DIARY: DiaryData = {
  brand: 'FDV CONCIERGE',
  destination: 'Morocco',
  year: '2026',
  dateline: 'April 3 — 10, 2026',
  traveler: 'Sharon',
  signature: 'Sharon',
  tagline: 'The thread of life.',
  cover: {
    pullquote: 'Marrakech is a city you feel, not a city you check off.',
    intro:
      'Eight days winding from the Atlas down into the medina — riads with rooftops, mint tea at every hour, light I can still see when I close my eyes.',
  },
  days: [
    {
      n: 1,
      date: 'April 3',
      day_label: 'Day One',
      location: 'Arrival',
      sub_location: 'Atlas Mountains',
      mantra: 'Arrive softly.',
      hero: photo('day1-arrival-linen.png'),
      hero_alt: 'Linen curtains in afternoon light, Kasbah Bab Ourika',
      photos: [
        { src: photo('day1-mint-tea.png'), caption: 'mint tea, always' },
        { src: photo('day1-dinner-kasbah.png'), caption: 'el fenn at last' },
      ],
      moments: [
        { title: 'Check-in at Kasbah Bab Ourika', time: 'Afternoon', note: 'arrived.' },
        { title: 'Walk the Grounds', time: 'Afternoon', note: 'a divine day' },
        { title: 'Dinner at the Kasbah', time: 'Evening', note: 'never leaving' },
      ],
      journal:
        'Landed and drove straight up. The light through linen at four in the afternoon is the only light I want for the rest of my life. Mint tea on the terrace and that quiet you get in the mountains.',
      wardrobe: [
        { genomeKey: 'look:fdv:lillithcaftan:ivory.jpg', label: 'Lilith Caftan', detail: 'FIL DE VIE' },
        { genomeKey: 'footwear:khaite:otto:wht.jpg', label: 'Robe Slide', detail: 'Phoebe Philo' },
        { genomeKey: 'accessory:bag:demelier:santorini.jpg', label: 'Santorini Bag', detail: 'DeMellier' },
      ],
    },
    {
      n: 2,
      date: 'April 4',
      day_label: 'Day Two',
      location: 'Atlas Mountains',
      sub_location: 'Rest Day',
      mantra: "Slow down. You'll see more.",
      hero: photo('day2-pool-lunch.png'),
      hero_alt: 'Pool and terracotta walls overlooking the Atlas',
      photos: [
        { src: photo('day2-breakfast.png'), caption: 'the best morning' },
        { src: photo('day2-terracotta.png'), caption: 'terracotta everywhere' },
      ],
      moments: [
        { title: 'Breakfast on the Terrace', time: 'Morning', note: 'the best morning' },
        { title: 'Reading, Walking, Rest', time: 'Afternoon', note: 'terracotta everywhere' },
        { title: 'Lunch by the Pool', time: 'Afternoon', note: 'so warm' },
      ],
      journal:
        'A whole day to do nothing. Read, swam, fell asleep on a daybed. The mountains do something to time — afternoons last twice as long. Linen and a long lunch and not one schedule to keep.',
    },
    {
      n: 3,
      date: 'April 5',
      day_label: 'Day Three',
      location: 'Atlas',
      sub_location: 'Marrakech',
      mantra: 'Let yourself get a little lost.',
      hero: photo('day3-rooftop-elfenn.png'),
      hero_alt: 'Sunset rooftop at El Fenn, Koutoubia in the distance',
      photos: [
        { src: photo('day3-rooftop-sunset.png'), caption: 'pink sky, every night' },
        { src: photo('day3-arches.png'), caption: 'the day in marrakech' },
      ],
      moments: [
        { title: 'Drive to Marrakech', time: 'Morning', note: 'back to the city' },
        { title: 'Check-in at El Fenn', time: 'Afternoon', note: 'the day in marrakech' },
        { title: 'Rooftop Snacks & Cocktails', time: 'Evening', note: 'coming here every night' },
      ],
      journal:
        'Down out of the mountains and into the medina. El Fenn at the edge — exactly where you want to be. Climbed up for sunset and the call to prayer started at the same moment the sky turned pink. Rooftop, every night.',
    },
    {
      n: 4,
      date: 'April 6',
      day_label: 'Day Four',
      location: 'Marrakech',
      sub_location: 'The Medina',
      mantra: 'You be the canvas. Let the city be the color.',
      hero: `${MOROCCO_GUIDE_IMG}/eat-2-break.jpg`,
      hero_alt: 'Marble and gold at Café Bacha, Dar el Bacha Palace',
      photos: [
        { src: `${MOROCCO_GUIDE_IMG}/exp-1-large.jpg`, caption: 'stopped breathing twice' },
        { src: `${MOROCCO_GUIDE_IMG}/eat-6-large.jpg`, caption: 'candles, candles, candles' },
      ],
      moments: [
        { title: 'Dar El Bacha', time: 'Morning', note: 'tile after tile' },
        { title: 'Bahia Palace', time: 'Afternoon', note: 'stopped breathing twice' },
        { title: 'Royal Mansour Tea', time: 'Afternoon', note: 'absurd, in the best way' },
        { title: 'Dinner at Dar Yacout', time: 'Evening', note: 'candles, candles, candles' },
      ],
      journal:
        'A full medina day. Tile, courtyard, fountain, repeat. Tea at the Royal Mansour because why not, and Dar Yacout for dinner — three hundred candles up to a rooftop. I stopped trying to take pictures and just stayed in it.',
    },
    {
      n: 5,
      date: 'April 7',
      day_label: 'Day Five',
      location: 'Coast',
      sub_location: 'Essaouira',
      mantra: 'The sea changes the conversation.',
      hero: photo('day5-essaouira-roof.png'),
      hero_alt: 'Essaouira ramparts and Atlantic',
      photos: [
        { src: photo('day5-essaouira-rocks.png'), caption: 'salt on everything' },
        { src: photo('day5-beach-club.png'), caption: 'lunch on the sand' },
      ],
      moments: [
        { title: 'Drive to Essaouira', time: 'Morning', note: 'three hours, all blue' },
        { title: 'Lunch at the Beach Club', time: 'Afternoon', note: 'salt on everything' },
        { title: 'Walk the Ramparts', time: 'Afternoon', note: 'the wind never stops' },
      ],
      journal:
        'Out of the medina, west to the coast. Three hours and the world goes blue. Essaouira does something Marrakech can’t — strips it back. White, blue, salt, wind. Lunch on the sand, a long walk along the ramparts, and back in time for the sky to do its thing.',
    },
    {
      n: 6,
      date: 'April 8',
      day_label: 'Day Six',
      location: 'Marrakech',
      sub_location: 'The Souks',
      mantra: 'Buy the thing. You came all this way.',
      hero: photo('day6-elfenn-dinner.png'),
      hero_alt: 'Candlelit table at El Fenn, evening',
      photos: [
        { src: photo('day6-yacout.png'), caption: 'three hundred candles' },
      ],
      moments: [
        { title: 'Souk Crawl with Mustapha', time: 'Morning', note: 'a guide changes everything' },
        { title: 'Late Lunch at Nomad', time: 'Afternoon', note: 'rooftop, again' },
        { title: 'Dinner at El Fenn', time: 'Evening', note: 'candles, again' },
      ],
      journal:
        'Day for the souks. Found Mustapha through the riad and it changed everything — three hours of being walked through doors I would have walked past. Two rugs, a brass tray, a pair of slippers. Dinner at El Fenn under the stars. The kind of day you can’t plan twice.',
    },
    {
      n: 7,
      date: 'April 9',
      day_label: 'Day Seven',
      location: 'Atlas Edge',
      sub_location: 'Departure',
      mantra: 'Leave a little behind so you have to come back.',
      hero: photo('day7-camel-sunset.png'),
      hero_alt: 'Camel silhouettes at sunset, Agafay desert',
      photos: [
        { src: photo('day1-mint-tea.png'), caption: 'one last tea' },
      ],
      moments: [
        { title: 'Sunrise at the Riad', time: 'Morning', note: 'quiet courtyard' },
        { title: 'Agafay Desert Camel Ride', time: 'Afternoon', note: 'the long view' },
        { title: 'Departure', time: 'Evening', note: 'already booking the next one' },
      ],
      journal:
        'Last day. Slow morning, one more mint tea, and out into the Agafay before the flight. The light at five in the desert is its own thing — nothing prepares you for it. Came home with sand in my shoes and a list of things to come back for.',
    },
  ],
};
