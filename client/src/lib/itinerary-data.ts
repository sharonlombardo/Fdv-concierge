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
  contact?: string;
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

export type ItineraryPage = CoverPage | IntroPage | FieldNotesPage | DayPage | JournalPage;

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
        time: '9:00 AM', 
        heading: 'MORNING', 
        title: 'Arrival at Marrakech Menara', 
        image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200', 
        description: 'Arrival at Marrakech Menara Airport, a masterpiece of modern Islamic architecture. Your private transfer will meet you for the 60-minute ascent into the Atlas range.',
        wardrobe: 'Breathable travel layers. Natural linen or soft cotton recommended.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
        contact: '+212 5244-47910',
        map: 'https://www.google.com/maps/search/RAK+Airport+Marrakech'
      },
      { 
        id: 'd1-2', 
        time: '2:30 PM', 
        heading: 'AFTERNOON', 
        title: 'Check-in at Kasbah Bab Ourika', 
        image: 'https://images.unsplash.com/photo-1505089182331-50e58f00062b?auto=format&fit=crop&q=80&w=1200',
        description: 'Check-in at Kasbah Bab Ourika. Perched on a hilltop in the Ourika Valley, this eco-lodge offers 360-degree views of the Atlas Mountains.',
        wardrobe: 'Mountain casual. A light cashmere wrap for the afternoon.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
        contact: '+212 661-634234',
        map: 'https://www.google.com/maps/search/Kasbah+Bab+Ourika'
      },
      {
        id: 'd1-3',
        time: '7:30 PM',
        heading: 'EVENING',
        title: 'Dinner at the Kasbah',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1200',
        description: 'Dinner using organic produce from the Kasbah gardens. A quiet evening as the temperature drops in the valley.',
        wardrobe: 'Warm knitwear or heavy wrap.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
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
    fieldNotes: "Mornings in the valley are quiet. The Ourika Valley is known for its red earth and ancient Berber traditions.",
    flow: [
      { 
        id: 'd2-1', 
        time: '8:30 AM', 
        heading: 'MORNING', 
        title: 'Village Walk & Hike', 
        image: 'https://images.unsplash.com/photo-1536713009761-0d3815e109d9?auto=format&fit=crop&q=80&w=1200',
        description: 'Optional gentle hike through nearby Berber villages. Witness the traditional way of life.',
        wardrobe: 'Active mountain wear. Sturdy sneakers or hiking boots. Protective sun hat.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'd2-2',
        time: '1:00 PM',
        heading: 'AFTERNOON',
        title: 'Pool & Reading',
        image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1200',
        description: 'Unstructured time. The mountain midday sun is best enjoyed by the infinity pool.',
        wardrobe: 'Swimwear and cover-up.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1574914629385-d7d1e83161df?auto=format&fit=crop&q=80&w=800'
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
    mantra: "El Fenn reveals itself slowly.",
    fieldNotes: "Descending from the peaks back into the Red City. The energy shifts from the horizontal landscape of the mountains to the vertical architecture of the Medina.",
    flow: [
      { 
        id: 'd3-1', 
        time: '1:00 PM', 
        heading: 'AFTERNOON', 
        title: 'Check-in at El Fenn', 
        image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ea337?auto=format&fit=crop&q=80&w=1200',
        description: 'El Fenn is your anchor in Marrakech. A sanctuary of bold colors, resident tortoises, and curated modern art.',
        wardrobe: 'Urban chic transition. Polished linen sets.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
        contact: '+212 5244-41210',
        map: 'https://www.google.com/maps/search/El+Fenn+Marrakech'
      },
      {
        id: 'd3-2',
        time: '6:30 PM',
        heading: 'EVENING',
        title: 'Sunset at El Fenn',
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=1200',
        description: 'Rooftop cocktails and dinner. The ultimate spot for sunset over the Koutoubia Mosque.',
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
    mantra: "Rest in the afternoon so the evening feels effortless.",
    fieldNotes: "The Medina is a labyrinth of craft and history. Today is about navigating the layers of the city, from palace ruins to modern rooftop dining.",
    flow: [
      { 
        id: 'd4-1', 
        time: '10:00 AM', 
        heading: 'MORNING', 
        title: 'Bacha Coffee & Dar El Bacha', 
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
        description: "Housed in a 1910 pasha's palace, Bacha Coffee offers a legendary coffee list in a room of intricate tilework.",
        wardrobe: 'Elegant morning attire. Modest but polished.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1550614000-4b9519e0947f?auto=format&fit=crop&q=80&w=800',
        contact: '+212 5243-81297',
        map: 'https://www.google.com/maps/search/Bacha+Coffee+Marrakech'
      },
      { 
        id: 'd4-2', 
        time: '7:30 PM', 
        heading: 'EVENING', 
        title: 'Dinner at Dar Yacout', 
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=1200',
        description: 'A Marrakech institution. Legendary for its atmosphere, traditional live music, and a multi-course Moroccan banquet.',
        wardrobe: 'Evening formal. Dress up for this institution.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800',
        contact: '+212 5243-82929',
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
    mantra: "Essaouira is about air and openness.",
    fieldNotes: "A pause from the city. Essaouira is the 'Windy City' of Africa. The air is cooler, the Medina is blue-and-white.",
    flow: [
      { 
        id: 'd5-1', 
        time: '8:30 AM', 
        heading: 'MORNING', 
        title: 'Essaouira Ramparts', 
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
        description: 'Explore the 18th-century seafront ramparts and the historic port with its fleet of bright blue wooden fishing boats.',
        wardrobe: 'Coastal layers. A windbreaker or light trench is essential.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1577900232427-18219b9166a3?auto=format&fit=crop&q=80&w=800',
        map: 'https://www.google.com/maps/search/Essaouira+Ramparts'
      },
      { 
        id: 'd5-2', 
        time: '7:30 PM', 
        heading: 'EVENING', 
        title: 'Dinner at +61', 
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
        description: 'Modern, fresh Australian-influenced cuisine in the Gueliz district.',
        wardrobe: 'Casual evening chic. Jeans and a nice top.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
        contact: '+212 5244-33777',
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
    fieldNotes: "Pattern and shadow. Today we focus on the artistic heritage of the city, from the Saadian tilework to the olfactory history of Moroccan perfume.",
    flow: [
      { 
        id: 'd6-1', 
        time: '6:00 PM', 
        heading: 'EVENING', 
        title: 'Maison Arabe Cooking Class', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
        description: 'A chef-led workshop in a tranquil garden setting. Learn the alchemy of Moroccan spices.',
        wardrobe: 'Smart casual. Comfortable shoes for standing.',
        contact: '+212 5243-87010',
        map: 'https://www.google.com/maps/search/La+Maison+Arabe+Marrakech'
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
    mantra: "Dress simply but beautifully. The desert does the rest.",
    fieldNotes: "The city loosens its grip. Jardin Majorelle offers a botanical sanctuary before we head out to the stone desert. Note: The Agafay is a 'Reg' (stone desert).",
    flow: [
      { 
        id: 'd7-1', 
        time: '10:00 AM', 
        heading: 'MORNING', 
        title: 'Jardin Majorelle', 
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200',
        description: 'Jardin Majorelle is a famous botanical garden known for its vibrant cobalt blue buildings. Originally created by Jacques Majorelle.',
        wardrobe: 'Vibrant colors or monochrome white to pop against the Majorelle Blue.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1589465885857-44ed45993464?auto=format&fit=crop&q=80&w=800',
        ticketLink: 'https://www.jardinmajorelle.com/en/official-ticketing/',
        contact: '+212 5243-13047',
        map: 'https://www.google.com/maps/search/Jardin+Majorelle+Marrakech'
      },
      { 
        id: 'd7-2', 
        time: '6:30 PM', 
        heading: 'EVENING', 
        title: 'Desert Dinner: Agafay', 
        image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=1200',
        description: 'Sunset camel ride followed by dinner in a luxury stone desert camp. The silence of the desert at dusk is unparalleled.',
        wardrobe: 'Desert chic with heavy layers. Temperatures drop significantly at night.',
        commercialWardrobe: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    day: 8,
    id: 'd8',
    date: "Friday, April 10, 2026",
    location: "Marrakech",
    title: "Daily Flow: Return",
    weather: { temp: 75, cond: "Sunny" },
    mantra: "The journey continues, just in a different rhythm.",
    fieldNotes: "One last walk through familiar paths. Memory begins to settle in now. Unpack slowly.",
    flow: [
      { 
        id: 'd8-1', 
        time: '11:30 AM', 
        heading: 'AFTERNOON', 
        title: 'Transit', 
        image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200', 
        description: 'Transfer to Menara Airport for the flight home.', 
        wardrobe: 'Comfortable travel knits.' 
      }
    ]
  },
  { 
    type: 'journal', 
    title: 'THE LOG', 
    subtitle: 'COLLECTED MEMORIES' 
  }
];
