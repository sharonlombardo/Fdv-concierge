# FDV Concierge Design Guidelines

## Design Approach: Reference-Based Luxury

**Primary References:** Aman Resorts, Mr Porter, Airbnb Luxe
**Justification:** High-end luxury travel/e-commerce demands visual sophistication and emotional engagement. Drawing from established luxury brands ensures credibility while maintaining minimalist elegance.

**Core Principles:**
- Luxury minimalism: Generous whitespace, restrained elegance
- Visual storytelling: Photography-first presentation
- Subtle sophistication: No flashy animations or excessive interactions
- Curated experience: Every element purposefully placed

## Typography

**Font Families:**
- Headings: Playfair Display (serif, luxury aesthetic)
- Body: Inter or Helvetica Neue (clean, readable sans-serif)

**Hierarchy:**
- Hero Headlines: text-6xl to text-7xl, font-light or font-normal
- Section Headers: text-4xl to text-5xl, font-light
- Subheadings: text-2xl to text-3xl, font-normal
- Body Text: text-base to text-lg, leading-relaxed
- Captions/Labels: text-sm, tracking-wide, uppercase for luxury feel

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 8, 12, 16, 24 for consistency
- Component padding: p-8, p-12, p-16
- Section spacing: py-24, py-32
- Grid gaps: gap-8, gap-12

**Container Strategy:**
- Full-bleed hero: w-full with no max-width
- Content sections: max-w-7xl mx-auto
- Text content: max-w-4xl for optimal reading

**Grid Patterns:**
- Desktop: 2-3 column layouts for destinations/products (lg:grid-cols-2, lg:grid-cols-3)
- Tablet: md:grid-cols-2
- Mobile: Single column stack

## Component Library

**Navigation:**
- Minimal header: Logo left, sparse menu items right
- Transparent overlay on hero, solid on scroll
- Search icon prominently placed
- Account/Cart icons (for e-commerce)

**Hero Section:**
- Full-screen or near full-screen (min-h-screen)
- Large, immersive photography
- Centered headline with generous spacing
- Single primary CTA with blurred background (backdrop-blur-sm bg-white/10)
- Minimal overlay text to let imagery shine

**Destination/Product Cards:**
- Large, high-quality images (aspect-[4/3] or aspect-[3/4])
- Minimal text overlay: Title, location/category, price
- Subtle hover effects: gentle scale or opacity transitions
- Border-none for seamless appearance

**Content Sections:**
- Alternating image-text layouts for storytelling
- Feature grids with generous spacing (gap-12 to gap-16)
- Testimonials: Full-width quotes with client images, 2-column on desktop

**Footer:**
- Multi-column layout (destinations, services, company, contact)
- Newsletter signup with elegant form
- Social links with icon-only presentation
- Legal links in smaller text

**Forms:**
- Minimal styling: border-b only, no full borders
- Generous input spacing (py-4)
- Floating labels for elegance
- Subtle focus states

**Buttons:**
- Primary: Solid with hover brightness change
- Secondary: Outline with hover fill
- Minimal rounded corners (rounded-sm or rounded)
- Generous padding (px-8 py-3)

## Images

**Hero Section:** 
Large, aspirational lifestyle image showcasing luxury travel experience - think infinity pools, exotic destinations, or curated experiences. Full-screen width, high resolution. Image should evoke emotion and desire.

**Destination/Product Grid:**
Professional photography of travel destinations or products. Each card features one high-quality image. Consistent aspect ratios throughout.

**Editorial Sections:**
Lifestyle imagery showing experiences, not just places. People enjoying travel moments, intimate resort details, artisan products.

**Testimonial Section:**
Circular client portraits (rounded-full), professional headshots against neutral backgrounds.

**About/Story Section:**
Behind-the-scenes imagery, founder story visuals, brand craftsmanship details.

All images should maintain consistent quality, color grading towards muted/sophisticated tones, and support the luxury minimalist aesthetic.