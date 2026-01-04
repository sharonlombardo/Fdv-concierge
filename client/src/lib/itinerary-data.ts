export interface WardrobeExtra {
  id: string;
  name: string;
  image: string;
  shopLink?: string;
}

export interface FlowItem {
  id: string;
  time: string;
  heading: string;
  title: string;
  image: string;
  description?: string;
  body?: string;
  wardrobe?: string;
  commercialWardrobe?: string;
  wardrobeExtras?: WardrobeExtra[];
  contact?: string;
  email?: string;
  address?: string;
  notes?: string;
  map?: string;
  ticketLink?: string;
}

export interface DayPage {
  day: number;
  id: string;
  date: string;
  location: string;
  title: string;
  weather: { temp: number; cond: string };
  mantra: string;
  fieldNotes: string;
  flow: FlowItem[];
}

export interface CoverPage {
  type: 'cover';
  title: string;
  subtitle: string;
  image: string;
  caption: string;
}

export interface IntroPage {
  type: 'intro';
  title: string;
  body: string[];
}

export interface FieldNotesPage {
  type: 'field-notes-global';
  title: string;
  notes: { title: string; text: string }[];
}

export interface JournalPage {
  type: 'journal';
  title: string;
  subtitle: string;
}

export interface PackingListPage {
  type: 'packing-list';
  title: string;
  subtitle: string;
}

export type ItineraryPage = CoverPage | IntroPage | FieldNotesPage | DayPage | JournalPage | PackingListPage;

export const ITINERARY_DATA: ItineraryPage[] = [
  {
    type: 'cover',
    title: 'MOROCCO',
    subtitle: 'APRIL 2026',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200',
    caption: 'The light of the Maghreb.'
  },
  {
    type: 'intro',
    title: 'THE RHYTHM',
    body: [
      "Morocco is a place of rhythm rather than itinerary. Light shifts quickly. Mornings are generous, afternoons ask for pause, evenings reward attention. The landscape moves from mountain to city to sea, each setting offering a different way of inhabiting time.",
      "This journey is designed to unfold with ease. Architecture, food, and movement are woven together with moments of rest and openness. Nothing here is meant to be rushed or completed. Follow what draws you, linger where it feels right, and let the experience gather meaning as you go.",
      "Morocco rewards presence more than planning."
    ]
  },
  {
    type: 'field-notes-global',
    title: 'TRAVEL NOTES',
    notes: [
      { title: '1. Dress With Ease', text: 'Loose layers, natural fabrics, and covered shoulders feel most comfortable here.' },
      { title: '2. Walk Softly', text: 'Medinas are beautiful and uneven. Comfortable shoes matter more than you think.' },
      { title: '3. Carry Small Cash', text: 'Small bills are useful for souks, cafes, and taxis.' },
      { title: '4. Follow the Light', text: 'Early mornings and late afternoons are when the city feels most generous.' },
      { title: '5. Rooftops Over Rush', text: 'A rooftop drink at sunset often says more than another stop.' },
      { title: '6. Accept the No', text: 'A polite "no, thank you" goes a long way in the souks.' },
      { title: '7. Eat Simply, Eat Well', text: 'Lunches are relaxed. Dinners are about mood. Trust your appetite.' },
      { title: '8. Hammam Is a Reset', text: "It's meant to ground you, not rush you." }
    ]
  },
  {
    day: 1,
    id: 'd1',
    date: "Friday, April 3, 2026",
    location: "Arrival / Atlas Mountains",
    title: "Daily Flow: Arrival",
    weather: { temp: 72, cond: "Sunny" },
    mantra: "Today is about arrival and decompression. No need to do more.",
    fieldNotes: "Arrival in the Red City. The transition from the bustle of Marrakech Menara to the stillness of the Ourika Valley sets the tone for the journey.",
    flow: [
      { 
        id: 'd1-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Arrival at Marrakech Menara Airport', 
        image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200', 
        description: 'Arrival at Marrakech Menara Airport, a masterpiece of modern Islamic architecture.',
        wardrobe: 'Breathable travel layers. Natural linen or soft cotton recommended.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 447 910',
        address: 'Ménara, Marrakech 40000',
        notes: 'International arrivals, currency exchange inside terminal',
        map: 'https://www.google.com/maps/search/Marrakech+Menara+Airport'
      },
      { 
        id: 'd1-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Transfer to the Atlas Mountains', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Private transfer for the 60-minute ascent into the Atlas range. Watch the landscape transform from city to valley.'
      },
      { 
        id: 'd1-3', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Check-in at Kasbah Bab Ourika', 
        image: 'https://images.unsplash.com/photo-1505089182331-50e58f00062b?auto=format&fit=crop&q=80&w=1200',
        description: 'Perched on a hilltop in the Ourika Valley, this eco-lodge offers 360-degree views of the Atlas Mountains.',
        wardrobe: 'Mountain casual. A light cashmere wrap for the afternoon.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 368 200',
        email: 'reservations@babourika.com',
        address: 'Ourika Valley, 35 km from Marrakech',
        notes: 'Transfer coordination, guided village walks',
        map: 'https://www.google.com/maps/search/Kasbah+Bab+Ourika'
      },
      {
        id: 'd1-4',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Walk the Grounds',
        image: 'https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200',
        description: 'Explore the organic gardens and terraces. Take in the mountain views.'
      },
      {
        id: 'd1-5',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Settle In and Rest',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
        description: 'Unpack, decompress, and let the mountain air settle in.'
      },
      {
        id: 'd1-6',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Dinner at the Kasbah',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200',
        description: 'Dinner using organic produce from the Kasbah gardens. A quiet evening as the temperature drops in the valley.',
        wardrobe: 'Warm knitwear or heavy wrap.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'd1-7',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Early Night',
        image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200',
        description: 'Rest early. The journey begins tomorrow.'
      }
    ]
  },
  {
    day: 2,
    id: 'd2',
    date: "Saturday, April 4, 2026",
    location: "Atlas Mountains",
    title: "Daily Flow: Atlas Mountains",
    weather: { temp: 68, cond: "Clear" },
    mantra: "Follow the light and your energy. This day is intentionally unstructured.",
    fieldNotes: "Kasbah Bab Ourika sits above the Ourika Valley, surrounded by olive trees and mountain air. This is a place to slow down before the city. Mornings are quiet. Afternoons invite walking, reading, or a gentle hike through nearby villages. Dress comfortably. Let the landscape set the pace.",
    flow: [
      { 
        id: 'd2-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Breakfast at the Kasbah', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Fresh breakfast with views of the Atlas range.',
        wardrobe: 'Relaxed morning layers. Comfortable linen or cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd2-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Walk the Grounds', 
        image: 'https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200',
        description: 'Explore the organic gardens and terraces at your own pace.'
      },
      { 
        id: 'd2-3', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Optional Village Walk or Light Hike', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Optional gentle hike through nearby Berber villages. Witness the traditional way of life.'
      },
      {
        id: 'd2-4',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Lunch at the Kasbah',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200',
        description: 'Lunch featuring organic produce from the gardens.',
        wardrobe: 'Relaxed afternoon layers. Light and breathable.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'd2-5',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Pool or Terrace Time',
        image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200',
        description: 'Unstructured time. The mountain midday sun is best enjoyed by the infinity pool.'
      },
      {
        id: 'd2-6',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Reading, Walking, or Rest',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
        description: 'Follow your energy. This time is intentionally unstructured.'
      },
      {
        id: 'd2-7',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Dinner at the Kasbah',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200',
        description: 'Another quiet evening with mountain views and organic cuisine.',
        wardrobe: 'Warm knitwear or heavy wrap for mountain evening.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'd2-8',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Early Night',
        image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200',
        description: 'Rest well before the transition to Marrakech.'
      }
    ]
  },
  {
    day: 3,
    id: 'd3',
    date: "Sunday, April 5, 2026",
    location: "Atlas Mountains / Marrakech",
    title: "Daily Flow: Atlas to Marrakech",
    weather: { temp: 78, cond: "Sunny" },
    mantra: "Spend time wandering the riad before going out. El Fenn reveals itself slowly.",
    fieldNotes: "El Fenn is your anchor in Marrakech. Spend your first afternoon wandering the riad's courtyards, hidden rooms, and rooftop terraces. Visit the El Fenn gift shop and settle in with snacks and cocktails as the light changes. Days move between architecture, souks, and rest. Evenings are about atmosphere, rooftops, and dressing up just enough.",
    flow: [
      { 
        id: 'd3-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Breakfast at the Kasbah', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Final breakfast with mountain views.',
        wardrobe: 'Relaxed morning layers. Comfortable linen or cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd3-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Final Walk and Views', 
        image: 'https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200',
        description: 'One last walk through the grounds before departure.'
      },
      { 
        id: 'd3-3', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Transfer to Marrakech', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Descend from the peaks back into the Red City. The energy shifts from the horizontal landscape of the mountains to the vertical architecture of the Medina.'
      },
      { 
        id: 'd3-4', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Optional Stop at Anima Garden', 
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200',
        description: 'A fantastical botanical garden created by Austrian artist Andre Heller. Worth a detour if time allows.',
        address: 'Douar Sbiti, Ourika Road',
        notes: 'Created by Andre Heller, shuttle from Marrakech available',
        map: 'https://www.google.com/maps/search/Anima+Garden+Marrakech'
      },
      { 
        id: 'd3-5', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Check-in at El Fenn', 
        image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200',
        description: 'El Fenn is your anchor in Marrakech. A sanctuary of bold colors, resident tortoises, and curated modern art.',
        wardrobe: 'Urban chic transition. Polished linen sets.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 441 010',
        email: 'info@elfenn.com',
        address: 'Derb Moulay Abdullah Ben Hezzian',
        notes: 'Rooftop cocktails, spa, gallery shop',
        map: 'https://www.google.com/maps/search/El+Fenn+Marrakech'
      },
      {
        id: 'd3-6',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Explore Courtyards and Hidden Rooms',
        image: 'https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&q=80&w=1200',
        description: 'Wander the riad at your own pace. Discover hidden corners, art pieces, and quiet terraces.'
      },
      {
        id: 'd3-7',
        time: 'Afternoon',
        heading: 'AFTERNOON',
        title: 'Visit El Fenn Gift Shop',
        image: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&q=80&w=1200',
        description: 'Browse the curated collection of Moroccan crafts and contemporary design.'
      },
      {
        id: 'd3-8',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Rooftop Snacks and Cocktails at El Fenn',
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=1200',
        description: 'Watch the light change over the Medina with cocktails and snacks.'
      },
      {
        id: 'd3-9',
        time: 'Evening',
        heading: 'EVENING',
        title: 'Dinner at El Fenn Rooftop',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
        description: 'The ultimate spot for dinner with sunset views over the Koutoubia Mosque.',
        wardrobe: 'Cocktail attire. Elevated but comfortable.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    day: 4,
    id: 'd4',
    date: "Monday, April 6, 2026",
    location: "Marrakech",
    title: "Daily Flow: Marrakech",
    weather: { temp: 81, cond: "Sunny" },
    mantra: "This is a full day. Rest in the afternoon so the evening feels effortless.",
    fieldNotes: "El Fenn is your anchor in Marrakech. Spend your first afternoon wandering the riad's courtyards, hidden rooms, and rooftop terraces. Visit the El Fenn gift shop and settle in with snacks and cocktails as the light changes. Days move between architecture, souks, and rest. Evenings are about atmosphere, rooftops, and dressing up just enough.",
    flow: [
      { 
        id: 'd4-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Breakfast at the Riad', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Start the day slowly at El Fenn. Fresh pastries, mint tea, and the quiet of the courtyard.',
        wardrobe: 'Relaxed morning layers. Linen or cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd4-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Dar El Bacha', 
        image: 'https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&q=80&w=1200',
        description: "A stunning 1910 pasha's palace, now a museum showcasing Moroccan craftsmanship and history.",
        contact: '+212 524 390 403',
        address: 'Rue Fatima Al Fihria, Medina',
        notes: 'Ticketed entry, mornings best',
        map: 'https://www.google.com/maps/search/Dar+El+Bacha+Marrakech'
      },
      { 
        id: 'd4-3', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Coffee at Bacha Coffee', 
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
        description: "Housed within Dar El Bacha, Bacha Coffee offers a legendary coffee list in a room of intricate tilework.",
        contact: '+212 524 386 090',
        address: 'Inside Dar El Bacha',
        notes: 'No reservations, expect wait midday',
        map: 'https://www.google.com/maps/search/Bacha+Coffee+Marrakech'
      },
      { 
        id: 'd4-4', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Lunch at Nomad', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
        description: 'Modern Moroccan cuisine with a rooftop terrace overlooking the spice souks. Fresh, inventive, and beautifully presented.',
        wardrobe: 'Smart casual. Light layers for the terrace.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 387 630',
        address: '1 Derb Aarjane, Rahba Lakdima',
        notes: 'Reservations recommended for lunch terrace',
        map: 'https://www.google.com/maps/search/Nomad+Restaurant+Marrakech'
      },
      { 
        id: 'd4-5', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Badi Palace', 
        image: 'https://images.unsplash.com/photo-1553522991-71439aa62779?auto=format&fit=crop&q=80&w=1200',
        description: 'A 16th-century ruined palace built by Sultan Ahmad al-Mansur. Dramatic sunken gardens, towering walls, and resident storks.',
        contact: '+212 524 378 163',
        address: 'Ksibat Nhass, Medina',
        notes: 'Open daily, modest entry fee, less crowded than Bahia',
        map: 'https://www.google.com/maps/search/Badi+Palace+Marrakech'
      },
      { 
        id: 'd4-6', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Souk Cherifia', 
        image: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&q=80&w=1200',
        description: 'A curated collective of boutiques featuring contemporary Moroccan design, textiles, and crafts.',
        contact: '+212 524 376 194',
        address: 'Sidi Abdelaziz, Medina',
        notes: 'Curated artisans, fixed pricing',
        map: 'https://www.google.com/maps/search/Souk+Cherifia+Marrakech'
      },
      { 
        id: 'd4-7', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Mustapha Blaoui', 
        image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?auto=format&fit=crop&q=80&w=1200',
        description: 'A legendary treasure house of Moroccan antiques, textiles, and lighting. Worth getting lost in.',
        contact: '+212 524 375 601',
        address: '142 Rue Sidi Abdelaziz',
        notes: 'By appointment feel, serious buyers only',
        map: 'https://www.google.com/maps/search/Mustapha+Blaoui+Marrakech'
      },
      { 
        id: 'd4-8', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Rest at El Fenn', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
        description: 'Return to the riad. Rooftop, pool, or quiet room. Recharge before the evening.'
      },
      { 
        id: 'd4-9', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Drinks at Royal Mansour', 
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
        description: 'One of the most opulent hotels in the world. Sip cocktails in the gardens or the rooftop bar.',
        wardrobe: 'Evening elegant. Dress to match the setting.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800',
        contact: '+212 529 808 080',
        address: 'Rue Abou Abbas El Sebti',
        notes: 'Bar reservations via concierge',
        map: 'https://www.google.com/maps/search/Royal+Mansour+Marrakech'
      },
      { 
        id: 'd4-10', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Dinner at Dar Yacout', 
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=1200',
        description: 'A Marrakech institution. Legendary for its atmosphere, traditional live music, and a multi-course Moroccan banquet.',
        contact: '+212 524 377 579',
        address: 'Derb Sidi Ahmed Soussi',
        notes: 'Mandatory reservation, fixed menu, early seating advised',
        map: 'https://www.google.com/maps/search/Dar+Yacout+Marrakech'
      }
    ]
  },
  {
    day: 5,
    id: 'd5',
    date: "Tuesday, April 7, 2026",
    location: "Essaouira (Day Trip)",
    title: "Daily Flow: Essaouira",
    weather: { temp: 70, cond: "Windy" },
    mantra: "Essaouira is about air and openness. Let the pace stay loose.",
    fieldNotes: "Essaouira is a pause. The air is cooler, the light softer, and the pace slower. Walk the ramparts, browse small galleries, eat by the water, and ride along the coast. Return to Marrakech before dark, refreshed by the open horizon.",
    flow: [
      { 
        id: 'd5-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Depart Marrakech', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Early departure for the 2.5 hour drive to the coast.',
        wardrobe: 'Coastal layers. A windbreaker or light trench is essential.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1577900232427-18219b9166a3?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd5-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Walk Ramparts and Old Town', 
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
        description: 'Explore the 18th-century seafront ramparts and the historic port with its fleet of bright blue wooden fishing boats.',
        address: 'Essaouira Medina, Atlantic Coast',
        notes: 'UNESCO World Heritage site, windy conditions common',
        map: 'https://www.google.com/maps/search/Essaouira+Ramparts'
      },
      { 
        id: 'd5-3', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Lunch at Dar Baba', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
        description: 'Fresh seafood and Moroccan classics in a charming medina setting.',
        wardrobe: 'Continue in coastal attire. Light layers.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1577900232427-18219b9166a3?auto=format&fit=crop&q=80&w=800',
        address: 'Rue Youssef el Fassi, Essaouira Medina',
        notes: 'Fresh seafood, rooftop terrace available',
        map: 'https://www.google.com/maps/search/Dar+Baba+Essaouira'
      },
      { 
        id: 'd5-4', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Coastal E-Bike Ride', 
        image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=1200',
        description: 'Ride along the coast with the Atlantic breeze. A refreshing way to explore.',
        notes: 'Arrange through local tour operator, helmets provided'
      },
      { 
        id: 'd5-5', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Walk Along the Water', 
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
        description: 'A final stroll along the beach before heading back.',
        address: 'Essaouira Beach',
        notes: 'Best views at sunset, can be windy'
      },
      { 
        id: 'd5-6', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Return to Marrakech', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Drive back to the Red City as the sun sets.'
      },
      { 
        id: 'd5-7', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Dinner at +61', 
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
        description: 'Modern, fresh Australian-influenced cuisine in the Gueliz district.',
        wardrobe: 'Casual evening chic. Jeans and a nice top.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 433 777',
        address: 'Gueliz district',
        map: 'https://www.google.com/maps/search/plus+61+Marrakech'
      }
    ]
  },
  {
    day: 6,
    id: 'd6',
    date: "Wednesday, April 8, 2026",
    location: "Marrakech / Culture & Food",
    title: "Daily Flow: Culture & Food",
    weather: { temp: 80, cond: "Sunny" },
    mantra: "This is a sensory day. Eat well, rest between moments.",
    fieldNotes: "Marrakech reveals itself through detail. Stone, pattern, and shadow give way to color and flavor. Mornings move through history and craft; afternoons slow the body down. Food becomes the bridge between culture and rest. Eat well. Pause often. Let the day unfold without rushing to the next thing.",
    flow: [
      { 
        id: 'd6-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Breakfast at the Riad', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Start the day slowly at El Fenn.',
        wardrobe: 'Relaxed morning layers. Comfortable linen or cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd6-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Saadian Tombs', 
        image: 'https://images.unsplash.com/photo-1553522991-71439aa62779?auto=format&fit=crop&q=80&w=1200',
        description: 'A stunning 16th-century royal necropolis, rediscovered in 1917. Intricate tilework and carved cedar.',
        address: 'Rue de la Kasbah, Medina',
        notes: 'Open daily, modest entry fee, mornings less crowded',
        map: 'https://www.google.com/maps/search/Saadian+Tombs+Marrakech'
      },
      { 
        id: 'd6-3', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'MAP Marrakech', 
        image: 'https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&q=80&w=1200',
        description: 'Museum of African Contemporary Art. A beautifully curated space in a restored building.',
        address: 'Place de la Kissaria, Medina',
        notes: 'Contemporary African art exhibitions',
        map: 'https://www.google.com/maps/search/MAP+Marrakech+Museum'
      },
      { 
        id: 'd6-4', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Lunch at La Famille', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
        description: 'A hidden garden restaurant serving vegetarian Moroccan cuisine. Fresh, seasonal, and beautifully presented.',
        wardrobe: 'Smart casual. Light and elegant.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        address: '42 Rue Riad Zitoun el Jdid, Medina',
        notes: 'Vegetarian focused, garden setting, no reservations',
        map: 'https://www.google.com/maps/search/La+Famille+Marrakech'
      },
      { 
        id: 'd6-5', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Rest at El Fenn', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
        description: 'Return to the riad. Pool, terrace, or quiet room. Recharge before the evening.'
      },
      { 
        id: 'd6-6', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Chef-led Cooking Workshop at La Maison Arabe', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
        description: 'A hands-on workshop in a tranquil garden setting. Learn the alchemy of Moroccan spices.',
        contact: '+212 524 387 010',
        address: 'Medina',
        notes: 'Cooking class reservations required',
        map: 'https://www.google.com/maps/search/La+Maison+Arabe+Marrakech'
      },
      { 
        id: 'd6-7', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Optional Hammam at El Fenn or La Mamounia', 
        image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200',
        description: 'A traditional hammam experience. Deep relaxation before the final days.',
        notes: 'Book in advance, private hammam recommended'
      },
      { 
        id: 'd6-8', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Dinner at Terrasse des Epices', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
        description: 'Rooftop dining in the heart of the medina. Moroccan and Mediterranean flavors with views.',
        wardrobe: 'Smart casual evening wear. Relaxed elegance for rooftop dining.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 375 904',
        address: 'Souk Cherifia, Medina',
        notes: 'Rooftop terrace, reservations recommended',
        map: 'https://www.google.com/maps/search/Terrasse+des+Epices+Marrakech'
      }
    ]
  },
  {
    day: 7,
    id: 'd7',
    date: "Thursday, April 9, 2026",
    location: "Marrakech & Agafay Desert",
    title: "Daily Flow: Desert Evening",
    weather: { temp: 84, cond: "Clear" },
    mantra: "Dress simply but beautifully. The desert does the rest. Evenings get chilly - bring a wrap.",
    fieldNotes: "The city loosens its grip today. Gardens and museums in the morning give way to open land and long horizons. The desert shifts scale and perspective, especially at dusk, when light softens and sound falls away. Dress simply. Watch the sun. Let the evening do the work.",
    flow: [
      { 
        id: 'd7-1', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Breakfast at the Riad', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Start the day slowly at El Fenn.',
        wardrobe: 'Relaxed morning layers. Comfortable linen or cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd7-2', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Jardin Majorelle', 
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200',
        description: 'A famous botanical garden known for its vibrant cobalt blue buildings. Originally created by Jacques Majorelle.',
        ticketLink: 'https://www.jardinmajorelle.com/en/official-ticketing/',
        contact: '+212 524 313 047',
        address: 'Rue Yves Saint Laurent, Gueliz',
        notes: 'Buy tickets online to skip lines',
        map: 'https://www.google.com/maps/search/Jardin+Majorelle+Marrakech'
      },
      { 
        id: 'd7-3', 
        time: 'Morning', 
        heading: 'MORNING', 
        title: 'Yves Saint Laurent Museum', 
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
        description: 'A stunning terracotta museum dedicated to the legendary designer. Adjacent to Jardin Majorelle.',
        address: 'Rue Yves Saint Laurent, Gueliz',
        notes: 'Adjacent to Jardin Majorelle, combined tickets available',
        map: 'https://www.google.com/maps/search/Yves+Saint+Laurent+Museum+Marrakech'
      },
      { 
        id: 'd7-4', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Transfer to Agafay Desert', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Drive out to the stone desert. The landscape opens up as the city fades.',
        wardrobe: 'Desert chic with layers. Temperatures drop significantly at night.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
        address: 'Agafay Desert, 40km from Marrakech',
        notes: '45-minute drive, arranged through tour operator'
      },
      { 
        id: 'd7-6', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Dune Buggy Ride', 
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1200',
        description: 'An exhilarating ride through the stone desert landscape.',
        notes: 'Safety gear provided, 30-45 minute ride'
      },
      { 
        id: 'd7-7', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Camel Ride at Sunset', 
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1200',
        description: 'A sunset camel ride through the desert. The silence at dusk is unparalleled.',
        notes: 'Guides assist with mounting, 20-30 minute ride'
      },
      { 
        id: 'd7-8', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Dinner in the Desert', 
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=1200',
        description: 'Dinner under the stars in a luxury stone desert camp.',
        notes: 'Traditional Moroccan dinner, stargazing included'
      },
      { 
        id: 'd7-9', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Return to Marrakech', 
        image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&q=80&w=1200',
        description: 'Drive back to the city under the stars.'
      }
    ]
  },
  {
    day: 8,
    id: 'd8',
    date: "Friday, April 10, 2026",
    location: "Marrakech",
    title: "RETURN",
    weather: { temp: 75, cond: "Sunny" },
    mantra: "The journey continues, just in a different rhythm.",
    fieldNotes: "Today is about returning gently. The pace shifts back toward the city, but with new ease. Familiar paths feel quieter now. What once demanded attention begins to settle into memory. Unpack slowly. Take a last walk. Let the rhythm soften before the journey home.",
    flow: [
      { 
        id: 'd8-1', 
        time: '07:30', 
        heading: 'MORNING', 
        title: 'Breakfast at the Riad', 
        image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1200',
        description: 'Final breakfast at El Fenn.',
        wardrobe: 'Comfortable travel layers. Natural linen or soft cotton.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'd8-2', 
        time: '08:30', 
        heading: 'MORNING', 
        title: 'Final Packing', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
        description: 'Take your time. Let the memories settle.'
      },
      { 
        id: 'd8-3', 
        time: '09:30', 
        heading: 'MORNING', 
        title: 'Check-out and Departure Preparations', 
        image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200',
        description: 'Final moments at El Fenn before the journey home.'
      },
      { 
        id: 'd8-4', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'Transfer to Marrakech Menara Airport', 
        image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200', 
        description: 'Transfer to the airport for your international flight.', 
        wardrobe: 'Comfortable travel layers. Breathable and relaxed.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        contact: '+212 524 447 910',
        address: 'Ménara, Marrakech 40000',
        notes: 'Allow 2 hours before international flights',
        map: 'https://www.google.com/maps/search/Marrakech+Menara+Airport'
      },
      { 
        id: 'd8-5', 
        time: 'Afternoon', 
        heading: 'AFTERNOON', 
        title: 'International Flight to New York', 
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200', 
        description: 'Begin the journey home.'
      },
      { 
        id: 'd8-6', 
        time: 'Evening', 
        heading: 'EVENING', 
        title: 'Arrival in New York', 
        image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=1200', 
        description: 'The journey continues, just in a different rhythm.'
      }
    ]
  },
  { 
    type: 'journal', 
    title: 'TRAVEL DIARY', 
    subtitle: 'COLLECTED MEMORIES' 
  },
  { 
    type: 'packing-list', 
    title: 'THE PACKING LIST', 
    subtitle: 'YOUR CURATED LOOKS' 
  }
];
