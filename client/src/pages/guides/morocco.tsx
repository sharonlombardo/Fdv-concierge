import { useState, FormEvent, useRef, useEffect, useCallback, Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { PinButton } from '@/components/pin-button';
import { EditorialProductOverlay, ShoppableIndicator, type EditorialProduct } from '@/components/editorial-product-overlay';
// editorial-sections only needed by /concierge — ItineraryTeaser is now a slim preview card
import { useUser } from '@/contexts/user-context';
import { useCustomImages } from '@/hooks/use-custom-images';
import { getProductByKey, getProductDisplayName, isShoppable, getShopImageUrl, FLOW_LOOK_GENOME_KEY, SECTION_LOOK_GENOME_KEY } from '@/lib/brand-genome';
import { useScrollDepth } from '@/hooks/use-scroll-depth';
import { useImageSlots } from '@/hooks/use-image-slot';
import { IMAGE_SLOTS } from '@shared/image-slots';
import './morocco-guide.css';

const IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco';
const DAY_PRODUCTS: EditorialProduct[] = [
  // Existing core trio (kept first so EDITORIAL_PRODUCT_MAP detail keys still resolve)
  { id: 'guide-day-1', brand: 'Fil de Vie', name: 'Juno Blouse & Marrakech Pants', price: null, shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fdv:junoblouse:marrakechpant:stripe.jpg' },
  { id: 'guide-day-2', brand: 'Bottega Veneta', name: 'Kalimero Bag', price: '$4,100', shopUrl: 'https://www.bottegaveneta.com/en-us/small-kalimero-citta-fondant-813744715.html', imageUrl: '', genomeKey: 'accessory:bag:bottega:kalimero:black.jpg' },
  { id: 'guide-day-3', brand: 'A Emery', name: 'Kir Sandal', price: '$185', shopUrl: 'https://aemery.com/products/the-kir-sandal-black', imageUrl: '', genomeKey: 'footwear, amery kit sandal.jpg' },
  // Bulgari necklace, Loewe sunglasses, Saint Jane sunscreen moved to EVE/TRAVEL where they belong
  // Extended SHOP THE STORY pieces — Day clothing
  { id: 'guide-day-cybel', brand: 'FIL DE VIE', name: 'Cybel Blouse & Marrakech Pants', price: '$395 & $350', shopUrl: 'https://fildevie.com/collections/tops-auto/products/cybele-blouse', imageUrl: '', genomeKey: 'LOOK:FDV:CYBELBLOUSE:STRIPE.jpg' },
  { id: 'guide-day-diana', brand: 'FIL DE VIE', name: 'Diana Dress', price: '$475', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'LOOK:FDV:DIANADRES:STRIPE.jpg' },
  { id: 'guide-day-bella-ivory', brand: 'FIL DE VIE', name: 'Bella Caftan Mini', price: '$475', shopUrl: 'https://fildevie.com/collections/caftans-auto/products/bella-caftan-mini', imageUrl: '', genomeKey: 'LOOK:FDV:BELLACAFTANMINI:IVORY.jpg' },
  { id: 'guide-day-bella-blk', brand: 'FIL DE VIE', name: 'Bella Caftan Mini', price: '$475', shopUrl: 'https://fildevie.com/collections/caftans-auto/products/bella-caftan-mini', imageUrl: '', genomeKey: 'Style_FDV_bella_mini_caftan_blk.jpg' },
  { id: 'guide-day-lucina-blk', brand: 'FIL DE VIE', name: 'Lucina Blouse & Marrakech Pants', price: '$575 & $350', shopUrl: 'https://fildevie.com/products/lucina-blouse', imageUrl: '', genomeKey: 'LOOK:FDV:LUCINABLOUSE:BLACK.jpg' },
  { id: 'guide-day-lucina-crm', brand: 'FIL DE VIE', name: 'Lucina Blouse & Marrakech Pants', price: '$575 & $350', shopUrl: 'https://fildevie.com/products/lucina-blouse', imageUrl: '', genomeKey: 'STYLE_FDV_LUCINA_BLOUSE_CRM.JPEG' },
  { id: 'guide-day-honora', brand: 'FIL DE VIE', name: 'Honora Dress', price: '$528', shopUrl: 'https://fildevie.com/collections/dresses/products/honora-dress', imageUrl: '', genomeKey: 'LOOK:FDV:HONORADRESS:FLORAL.jpg' },
  { id: 'guide-day-lillith', brand: 'FIL DE VIE', name: 'Lillith Caftan', price: '$475', shopUrl: 'https://fildevie.com/collections/shop-all/products/lilith-caftan', imageUrl: '', genomeKey: 'LOOK:FDV:LILLITHCAFTAN:IVORY.jpg' },
  { id: 'guide-day-astrid', brand: 'FIL DE VIE', name: 'Astrid Blouse', price: '$475', shopUrl: 'https://fildevie.com/collections/tops-auto/products/copy-of-astrid-blouse', imageUrl: '', genomeKey: 'LOOK:FDV:ASTRIDBLOUSE:BLK.jpg' },
  { id: 'guide-day-juno-blk', brand: 'FIL DE VIE', name: 'Juno Blouse', price: '$268', shopUrl: 'https://fildevie.com/products/juno-blouse', imageUrl: '', genomeKey: 'LOOK:FDV:JUNOBLOUSE:BLK.jpg' },
  // Day footwear
  { id: 'guide-day-ferragamo', brand: 'Ferragamo', name: 'Loly Fur Leather Thong Sandals', price: '$490', shopUrl: 'https://www.saksfifthavenue.com/product/ferragamo-loly-faux-fur-trim-leather-sandals-0400022855901.html', imageUrl: '', genomeKey: 'FOOTWEAR:FERRAGAMO:LOLYSANDAL:BLACK.jpg' },
  // Day bags
  { id: 'guide-day-demellier', brand: 'Demellier London', name: 'Santorini Basket Bag', price: '$355', shopUrl: 'https://www.saksfifthavenue.com/product/demellier-santorini-raffia-tote-bag-0400016036683.html', imageUrl: '', genomeKey: 'ACCESSORY:BAG:DEMELIER:SANTORINI.jpg' },
];

const EVE_PRODUCTS: EditorialProduct[] = [
  // Existing core trio (preserved for EDITORIAL_PRODUCT_MAP detail-image references)
  { id: 'guide-eve-1', brand: 'FDV', name: 'Isadora Dress', price: '$795', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fdv:isadoradress:blk.jpg' },
  { id: 'guide-eve-2', brand: 'Ala\u00efa', name: 'Heel Thong Mules in Velvet', price: '$1,450', shopUrl: 'https://www.bergdorfgoodman.com/p/alaia-velvet-kitten-heel-thong-sandals-prodt196740019', imageUrl: '', genomeKey: 'footwear:alaia:black.jpg' },
  { id: 'guide-eve-3', brand: 'Chlo\u00e9', name: 'Wristlette Bag', price: '$4,200', shopUrl: 'https://www.chloe.com/en-us/p/bags/shoulder-bag/CH5US623P57001.html', imageUrl: '', genomeKey: 'access:bag:chloe:wristlette:black.jpg' },
  { id: 'guide-eve-4', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'feb 26 prod info pg 1.jpg - item 6' },
  { id: 'guide-eve-5', brand: 'Hildegard', name: 'Immortelle Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: '', genomeKey: 'beauty:imortelle oil.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-eve-6', brand: 'PoppyKing', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: '', genomeKey: 'beauty:poppyking:sinlipstick:red.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  // Extended Evening clothing
  { id: 'guide-eve-philomena', brand: 'FIL DE VIE', name: 'Philomena Caftan', price: '$1,250', shopUrl: 'https://fildevie.com/collections/caftans-auto/products/philomena-caftan-coat', imageUrl: '', genomeKey: 'LOOK:FDV:PHILOMENACAFTAN:SAND.jpg' },
  { id: 'guide-eve-stevie', brand: 'FIL DE VIE', name: 'Stevie Caftan', price: '$825', shopUrl: 'https://fildevie.com/products/stevie-caftan', imageUrl: '', genomeKey: 'LOOK:FDV:STEVIECAFTAN:BLACK.jpg' },
  { id: 'guide-eve-virginia', brand: 'FIL DE VIE', name: 'Virginia Dress', price: '$700', shopUrl: 'https://fildevie.com/products/virginia-dress-velvet', imageUrl: '', genomeKey: 'LOOK:FDV:VIRGINIADRESS:EMERALD.jpg' },
  { id: 'guide-eve-calypso', brand: 'FIL DE VIE', name: 'Calypso Dress', price: '$600', shopUrl: 'https://fildevie.com/collections/dresses/products/calypso-dress', imageUrl: '', genomeKey: 'LOOK:FDV:CALYPSODRESS:BLACK.jpg' },
  { id: 'guide-eve-medina', brand: 'FIL DE VIE', name: 'Medina Dress', price: '$650', shopUrl: 'https://fildevie.com/collections/dresses/products/copy-of-medina-dress', imageUrl: '', genomeKey: 'LOOK:FDV:MEDINADRESS:BLK.jpg' },
  { id: 'guide-eve-longcaftan', brand: 'FIL DE VIE', name: 'Long Caftan Dress', price: '$825', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fildevie:longcaftandress:red.jpg' },
  { id: 'guide-eve-este', brand: 'FIL DE VIE', name: 'Este Dress', price: '$675', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fildevie:estedress:black.jpg' },
  { id: 'guide-eve-column', brand: 'FIL DE VIE', name: 'Column Dress', price: '$745', shopUrl: 'https://www.fildevie.com', imageUrl: '', genomeKey: 'LOOK:FILDEVIE:COLUMNDRESS:BLACK.jpg' },
  { id: 'guide-eve-silkset', brand: 'FIL DE VIE', name: 'Crepe Silk Set', price: '$498', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'STYLE_FDV_SILK_SET_BLK.jpg' },
  // Evening bags
  { id: 'guide-eve-driesbag', brand: 'Dries Van Noten', name: 'Embellished Evening Bag', price: '$1,640', shopUrl: 'https://www.parlourx.com/products/envelope-embroidered-clutch-on-chain-black-gold-1', imageUrl: '', genomeKey: 'ACCESSORY:BAG:DRIESVANNOTEN:BLACK.jpg' },
  { id: 'guide-eve-paco', brand: 'Paco Rabanne', name: 'Gold Pailette Handbag', price: '$1,490', shopUrl: 'https://fashion.rabanne.com/en-us/products/26pss0548emb025-p710/', imageUrl: '', genomeKey: 'feb 26 prod info pg 1.jpg - Item 1' },
  { id: 'guide-eve-bottega', brand: 'Bottega Veneta', name: 'Solstice Bag', price: '$4,200', shopUrl: 'https://www.bergdorfgoodman.com/p/bottega-veneta-small-solstice-shoulder-bag-prod178960146', imageUrl: '', genomeKey: 'feb 26 prod info pg 1.jpg - Item 5' },
  // Evening jewelry
  { id: 'guide-eve-philohallmark', brand: 'Phoebe Philo', name: 'Hallmark Earrings', price: '$450', shopUrl: 'https://us.phoebephilo.com/products/hallmark-earrings-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'feb 26 pro info pg 66.jpg - Item 1' },
  { id: 'guide-eve-philodrop', brand: 'Phoebe Philo', name: 'Gold Drop Earrings', price: '$1,050', shopUrl: 'https://us.phoebephilo.com/products/double-ball-earrings-in-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'feb 26 prod info pg 1.jpg - Item 2' },
  { id: 'guide-eve-bulgariwatch', brand: 'Bulgari', name: 'Serpenti Watch', price: '$13,200', shopUrl: 'https://www.bulgari.com/en-us/watches/womens/serpenti-spiga-watch-rose-gold-ceramic-black-102532', imageUrl: '', genomeKey: 'ACCESSORY:BULGAR:SERPENTI:BLK.jpg' },
  { id: 'guide-eve-bulgaricabochon', brand: '1st Dibs (Bulgari)', name: 'Lapis Cabochon Necklace', price: '$50,000', shopUrl: 'https://www.1stdibs.com/jewelry/necklaces/pendant-necklaces/bvlgari-1980s-unheated-sapphire-gold-necklace/id-j_28202612/', imageUrl: '', genomeKey: 'accessory:jewelry:bulgari:cabachon necklace.jpg' },
];

/* ── What Travels Well — accessories + beauty + objects ── */
const TRAVEL_PRODUCTS: EditorialProduct[] = [
  // Sunglasses
  { id: 'guide-trv-philopeak', brand: 'Phoebe Philo', name: 'Peak Sunglasses', price: '$460', shopUrl: 'https://us.phoebephilo.com/products/peak-sunglasses-black-acetate', imageUrl: '', genomeKey: 'ACCESSORY:PHOEBEPHILO:PEAKSUNGLASSES:BLACK.jpg' },
  { id: 'guide-trv-loewe', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: '', genomeKey: 'ACCESS:SUGNLASSES:LOEWE:BLACK.jpg' },
  { id: 'guide-trv-philocruise', brand: 'Phoebe Philo', name: 'Cruise Sunglasses', price: '$490', shopUrl: 'https://us.phoebephilo.com/products/cruise-sunglasses-tawny-tortoiseshell-acetate', imageUrl: '', genomeKey: 'ACCESSORY:SUNGLASSES:PHOEBEPHILO:CRUISESUNGLASSES:TAWNY.jpg' },
  // Wraps & scarves
  { id: 'guide-trv-atlasscarf', brand: 'FIL DE VIE', name: 'Atlas Scarf', price: '$275', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'LOOK:FDV:ATLASSCARF:IVORY.jpg' },
  { id: 'guide-trv-gabriellawrap', brand: 'Gabriella Hearst', name: 'Lauren Knit Wrap', price: '$3,170', shopUrl: 'https://gabrielahearst.com/products/lauren-knit-wrap-oatmeal', imageUrl: '', genomeKey: 'ACCESSORY:GABRIELLAHEARST:WELFATCHASHMERE:SAND.jpg' },
  // Pool → Object of Desire
  { id: 'guide-trv-poolessentials', brand: 'FIL DE VIE', name: 'Pool Essentials', price: '$600', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'ACCESS:BAG:TOWEL:FDV:POOLESSENTIALS:OLIVE.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  // Beauty → Object of Desire
  { id: 'guide-trv-fdvparfum', brand: 'FIL DE VIE', name: 'Parfum', price: '$475', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'BEAUTY:FDV:PARFUM.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-fdvtravelmist', brand: 'FIL DE VIE', name: 'Travel Mist', price: '$75', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'BEAUTY:FDV:TRAVELMIST.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-immortelle', brand: 'Hildegaard', name: 'Immortelle Botanical Facial Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: '', genomeKey: 'beauty:imortelle oil.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-amanjade', brand: 'Aman Essentials', name: 'Ritual Gift Set', price: '$410', shopUrl: 'https://shop.aman.com/skincare/face-body-jade-ritual-set/', imageUrl: '', genomeKey: 'BEAUTY:AMANESSENTIALS:JADESET.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-poppyking', brand: 'Poppy King', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: '', genomeKey: 'BEAUTY:POPPYKING:SINLIPSTICK:RED.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-violette', brand: 'Violette_FR', name: 'Nectar Lip Stain', price: '$29', shopUrl: 'https://www.violettefr.com/products/lip-nectar-souci-d-automne', imageUrl: '', genomeKey: 'BEAUTY:VIOLETTEFR:NECATRLIPSTAIN.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-bienaime', brand: 'Bienaime', name: 'Rituel de Geisha Papers', price: '$23', shopUrl: 'https://www.beautyhabit.com/products/bienaime-the-', imageUrl: '', genomeKey: 'BEAUTY:RITUELGEINSHA.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-saintjane', brand: 'Saint Jane', name: 'Sun Ritual Mineral SPF 30', price: '$38', shopUrl: 'https://saintjanebeauty.com/collections/sun-protection-spf/products/luxury-sun-ritual', imageUrl: '', genomeKey: 'BEAUTY:SAINJANE:SUNRITUAL.jpg', bucket: 'Objects of Desire', pinType: 'object' },
  { id: 'guide-trv-leprunier', brand: 'Le Prunier', name: 'Plumscreen Sunscreen', price: '$80', shopUrl: 'https://www.leprunier.com', imageUrl: '', genomeKey: 'le prunier sunscreen.jpg', bucket: 'Objects of Desire', pinType: 'object' },
];

const BLOB_V2 = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2';

/* ── Editorial product map: image slot key → products shown in that image ── */
const EDITORIAL_PRODUCT_MAP: Record<string, EditorialProduct[]> = {
  // Break 1 — Gaia Dress: hero garment + shoe + bag + accessory + beauty
  "morocco-tile-1": [
    { id: "edit-pp-gaia", brand: "Phoebe Philo", name: "Gaia Dress", price: "$2,360", shopUrl: "https://us.phoebephilo.com", imageUrl: `${BLOB_V2}/morocco-tile-1`, genomeKey: "look:phoebephilo:gaiadress:black.jpg" },
    { id: "edit-bulgari-cab", brand: "1st Dibs", name: "Lapis Cabochon Necklace", price: "$50,000", genomeKey: "accessory:jewelry:bulgari:cabachon necklace.jpg" },
    { id: "edit-emery-kir", brand: "A Emery", name: "Kir Sandal", price: "$185", genomeKey: "footwear, amery kit sandal.jpg" },
    { id: "edit-demellier-sant", brand: "DeMellier", name: "Santorini Basket Bag", price: "$355", genomeKey: "accessory:bag:demelier:santorini.jpg" },
    { id: "edit-leprunier", brand: "Le Prunier", name: "Plumscreen Sunscreen", price: "$80", genomeKey: "le prunier sunscreen.jpg" },
  ],
  // Break 2 — Alaïa Souk Coat
  "morocco-tile-3": [
    { id: "edit-alaia-coat", brand: "Alaïa", name: "Souk Coat & Desert Pant", price: "$1,200/$760", shopUrl: "https://www.alaia.com", imageUrl: `${BLOB_V2}/morocco-tile-3`, genomeKey: "Look:alia:soukcoat:desertpants:blush.jpg" },
    { id: "edit-loewe-cat", brand: "Loewe", name: "Inflated Cat Eye Sunglasses", price: "$440", genomeKey: "access:sugnlasses:loewe:black.jpg" },
    { id: "edit-bv-kalimero", brand: "Bottega Veneta", name: "Kalimero Bag", price: "$4,100", genomeKey: "accessory:bag:bottega:kalimero:black.jpg" },
    { id: "edit-pp-robe", brand: "Phoebe Philo", name: "Robe Slide", price: "$890", genomeKey: "footwear:khaite:otto:wht.jpg" },
    { id: "edit-bienaime", brand: "Bienaime", name: "Rituel De Geisha Papers", price: "$23", genomeKey: "beauty:rituelgeinsha.jpg" },
  ],
  // Break 3 — FDV Long Caftan Red
  "morocco-motion-1": [
    { id: "edit-fdv-caftan", brand: "Fil de Vie", name: "Long Caftan Dress, Red", price: "$825", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-motion-1`, genomeKey: "look:fildevie:longcaftandress:red.jpg" },
    { id: "edit-bulgari-serp", brand: "Bulgari", name: "Serpenti Watch", price: "$13,200", genomeKey: "accessory:bulgar:serpenti:blk.jpg" },
    { id: "edit-chloe-wrist", brand: "Chloé", name: "Wristlette", price: "$4,200", genomeKey: "access:bag:chloe:wristlette:black.jpg" },
    { id: "edit-alaia-mules", brand: "Alaïa", name: "Heel Thong Mules in Velvet", price: "$1,450", genomeKey: "footwear:alaia:black.jpg" },
    { id: "edit-poppy-lip", brand: "Poppy King", name: "Original Sin Lipstick", price: "$34", genomeKey: "beauty:poppyking:sinlipstick:red.jpg" },
  ],
  // Break 4 — FDV Este Dress
  "morocco-tile-5": [
    { id: "edit-fdv-este", brand: "Fil de Vie", name: "Este Dress", price: "$675", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-tile-5`, genomeKey: "look:fildevie:estedress:black.jpg" },
    { id: "edit-demellier-2", brand: "DeMellier", name: "Santorini Basket Bag", price: "$355", genomeKey: "accessory:bag:demelier:santorini.jpg" },
    { id: "edit-emery-kir-2", brand: "A Emery", name: "Kir Sandal", price: "$185", genomeKey: "footwear, amery kit sandal.jpg" },
    { id: "edit-pp-peak", brand: "Phoebe Philo", name: "Peak Sunglasses", price: "$460", genomeKey: "accessory:phoebephilo:peaksunglasses:black.jpg" },
    { id: "edit-fdv-mist", brand: "Fil de Vie", name: "Travel Mist", price: "$75", genomeKey: "beauty:fdv:travelmist.jpg" },
  ],
  // Break 5 — YSL Bikini
  "morocco-style-1": [
    { id: "edit-ysl-bikini", brand: "Yves Saint Laurent", name: "LouLou Bikini", price: "$795", shopUrl: "https://www.ysl.com", imageUrl: `${BLOB_V2}/morocco-style-1`, genomeKey: "look:ysl:bikini:black.jpg" },
    { id: "edit-fdv-pool", brand: "Fil de Vie", name: "Pool Essentials", price: "$600", genomeKey: "access:bag:towel:fdv:poolessentials:olive.jpg" },
    { id: "edit-pp-hoops", brand: "Phoebe Philo", name: "Gold Studded Hoops", price: "$550", genomeKey: "access:jewlery:phoebephilo:hoops.jpg" },
    { id: "edit-pp-peak-2", brand: "Phoebe Philo", name: "Peak Sunglasses", price: "$460", genomeKey: "accessory:phoebephilo:peaksunglasses:black.jpg" },
    { id: "edit-saintjane", brand: "Saint Jane", name: "Sun Ritual Mineral SPF 30", price: "$38", genomeKey: "beauty:sainjane:sunritual.jpg" },
  ],
  // Break 6 — FDV Column Dress
  "morocco-object-1": [
    { id: "edit-fdv-column", brand: "Fil de Vie", name: "Column Dress", price: "$745", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-object-1`, genomeKey: "look:fildevie:columndress:black.jpg" },
    { id: "edit-ferragamo", brand: "Ferragamo", name: "Loly Leather Thong Sandals", price: "$490", genomeKey: "footwear:ferragamo:lolysandal:black.jpg" },
    { id: "edit-demellier-3", brand: "DeMellier", name: "Santorini Basket Bag", price: "$355", genomeKey: "accessory:bag:demelier:santorini.jpg" },
    { id: "edit-pp-bombe", brand: "Phoebe Philo", name: "Bombe Sunglasses", price: "$750", genomeKey: "look:phoebephilo:bombesunglasses:brown.jpg" },
    { id: "edit-violette", brand: "Violette_FR", name: "Nectar Lip Stain", price: "$29", genomeKey: "beauty:violettefr:necatrlipstain.jpg" },
  ],
  // Wardrobe day images → DAY_PRODUCTS
  "ward-1-large": DAY_PRODUCTS,
  "ward-1-small1": [DAY_PRODUCTS[1]], // Bottega Kalimero
  "ward-1-small2": [DAY_PRODUCTS[2]], // Kir Sandal
  // Wardrobe evening hero — curated 5 products (Isadora Dress image)
  "ward-2-large": [
    { id: "ward-eve-isadora", brand: "FIL DE VIE", name: "Isadora Dress", price: "$795", shopUrl: "http://www.fildevie.com", imageUrl: "", genomeKey: "look:fdv:isadoradress:blk.jpg" },
    { id: "ward-eve-alaia", brand: "Alaïa", name: "Heel Thong Mules in Velvet", price: "$1,450", imageUrl: "", genomeKey: "footwear:alaia:black.jpg" },
    { id: "ward-eve-chloe", brand: "Chloé", name: "Wristlette", price: "$4,200", imageUrl: "", genomeKey: "access:bag:chloe:wristlette:black.jpg" },
    { id: "ward-eve-hoops", brand: "Phoebe Philo", name: "Gold Studded Hoops", price: "$550", imageUrl: "", genomeKey: "access:jewlery:phoebephilo:hoops.jpg" },
    { id: "ward-eve-oil", brand: "Hildegaard", name: "Immortelle Oil", price: "$375", imageUrl: "", genomeKey: "beauty:imortelle oil.jpg", bucket: "Objects of Desire", pinType: "object" },
  ],
  "ward-2-small1": [EVE_PRODUCTS[2]], // Chloé Wristlette
  "ward-2-small2": [EVE_PRODUCTS[5]], // PoppyKing lipstick
  // What Travels Well — now routes to Column Dress break (morocco-object-1)
  "ward-3-large": TRAVEL_PRODUCTS,
};

/* ── Place Contact — Zara-style address link + Instagram + phone icons ── */

function PlaceContact({
  address,
  url,
  venueName,
  instagramHandle,
}: {
  address: string;
  url?: string;
  venueName: string;
  instagramHandle?: string;
}) {
  const instagramHref = instagramHandle
    ? `https://www.instagram.com/${instagramHandle.replace(/^@/, '')}`
    : `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(venueName)}`;

  return (
    <div className="place-contact">
      {url ? (
        <a
          className="address-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {address}
        </a>
      ) : (
        <span className="address-link" style={{ textDecoration: 'none', cursor: 'default' }}>
          {address}
        </span>
      )}
      <span className="contact-icons">
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${venueName} on Instagram`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <Link href="/concierge-chat">
          <a aria-label={`Ask the concierge about ${venueName}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </Link>
      </span>
    </div>
  );
}

/* ── PlaceImages — horizontal carousel with chevron arrows + infinite loop (Zara style) ── */

function PlaceImages({
  layout,
  children,
}: {
  layout: 'a' | 'b' | 'c';
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const kids = Children.toArray(children);
  const count = kids.length;
  const hasMultiple = count > 1;

  // Clone last->start and first->end for infinite-loop visual peek on edges
  const cloneKid = (node: ReactNode, key: string): ReactNode =>
    isValidElement(node) ? cloneElement(node, { key }) : node;

  const rendered: ReactNode[] = hasMultiple
    ? [cloneKid(kids[count - 1], 'clone-last'), ...kids, cloneKid(kids[0], 'clone-first')]
    : kids;

  const scrollToDomIndex = useCallback((i: number, smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.children[i] as HTMLElement | undefined;
    if (!target) return;
    const offset = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
    el.scrollTo({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const currentDomIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const viewCenter = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(cCenter - viewCenter);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }, []);

  // Land on the first real slide (DOM index 1) so the cloned last peeks on the left
  useEffect(() => {
    if (!hasMultiple || initialized.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const r = requestAnimationFrame(() => {
      scrollToDomIndex(1, false);
      initialized.current = true;
    });
    return () => cancelAnimationFrame(r);
  }, [hasMultiple, scrollToDomIndex]);

  // When user lands on a clone, silently jump to its real counterpart
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasMultiple) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!initialized.current) return;
        const idx = currentDomIndex();
        if (idx === 0) {
          // landed on clone-of-last → jump to real last (DOM index = count)
          scrollToDomIndex(count, false);
        } else if (idx === count + 1) {
          // landed on clone-of-first → jump to real first (DOM index = 1)
          scrollToDomIndex(1, false);
        }
      }, 140);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [count, hasMultiple, currentDomIndex, scrollToDomIndex]);

  const goPrev = () => {
    const idx = currentDomIndex();
    scrollToDomIndex(idx - 1, true);
  };
  const goNext = () => {
    const idx = currentDomIndex();
    scrollToDomIndex(idx + 1, true);
  };

  return (
    <div className="place-images-wrap">
      <div ref={scrollRef} className={`place-images layout-${layout}`}>
        {rendered}
      </div>
      {hasMultiple && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={goNext}
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/* ── Itinerary Teaser — slim preview card that gates access to /concierge ── */

const TEASER_IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg';

function TripTeaserAndBriefForm() {
  const { user, email, setShowPassportGate, setPendingSaveCallback } = useUser();
  const [travelDates, setTravelDates] = useState('');
  const [duration, setDuration] = useState('');
  const [travelParty, setTravelParty] = useState('');
  const [priorities, setPriorities] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingSaveCallback(() => () => handleSubmit(e));
      setShowPassportGate(true);
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/trip-briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          destination: 'Morocco',
          travelDates,
          duration,
          travelParty,
          priorities,
          userEmail: email,
        }),
      });
      setSubmitted(true);
      // Open concierge with context
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-concierge'));
      }, 2000);
    } catch {
      // Still show confirmation
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(44, 36, 22, 0.15)',
    background: '#fff',
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 14,
    color: '#2c2416',
    outline: 'none',
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(44, 36, 22, 0.5)',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <>
      {/* ═══ TRIP TEASER — A taste of Day 1 ═══ */}
      <section style={{ background: '#faf9f6', padding: '64px 24px', margin: '40px 0 0' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', textAlign: 'center', marginBottom: 32 }}>
            A Taste of Your Trip
          </p>

          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.85, color: '#2c2416' }}>
            <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>Your First Day in Marrakech</p>

            <p style={{ marginBottom: 16 }}>
              Arrive. A private transfer is waiting — no haggling, no confusion. Your driver knows the way.
            </p>

            <p style={{ marginBottom: 16 }}>
              Check in at El Fenn. The riad is quiet, the courtyard pool is cool, and someone has already drawn the curtains against the afternoon sun. Take an hour.
            </p>

            <p style={{ marginBottom: 16 }}>
              Evening: Dinner at Le Jardin. Ask for the table under the banana leaves. Order the lamb tagine and the roasted aubergine — trust me. Wear the Isadora Dress. The courtyard is candlelit and you'll want to feel like you belong there.
            </p>

            <p style={{ marginBottom: 0 }}>
              After: Walk back through the medina. The lanterns are lit. The air smells like orange blossom. This is why you came.
            </p>
          </div>

          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(44, 36, 22, 0.45)', textAlign: 'center', marginTop: 32 }}>
            This is what a FIL DE VIE trip looks like. Every detail considered — from the transfer to the dress.
          </p>
        </div>
      </section>

      {/* ═══ TRIP BRIEF FORM — "Want yours?" ═══ */}
      <section style={{ background: '#faf9f6', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          {!submitted ? (
            <>
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 28, fontWeight: 400, textAlign: 'center', color: '#2c2416', marginBottom: 8 }}>
                Want yours?
              </h2>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, textAlign: 'center', color: 'rgba(44, 36, 22, 0.6)', lineHeight: 1.7, marginBottom: 36 }}>
                Tell us about your trip. We'll build the rest — your itinerary, your wardrobe, your packing list. Every detail, curated to you.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>When are you going?</label>
                  <input
                    type="text"
                    placeholder="October 2026, flexible, etc."
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>How long?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['A long weekend', 'A week', '10+ days', 'Not sure yet'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDuration(opt)}
                        style={{
                          padding: '8px 16px',
                          border: duration === opt ? '1px solid #2c2416' : '1px solid rgba(44, 36, 22, 0.15)',
                          background: duration === opt ? '#2c2416' : '#fff',
                          color: duration === opt ? '#fff' : '#2c2416',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Who with?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Just me', 'With a partner', 'With friends', 'Family'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTravelParty(opt)}
                        style={{
                          padding: '8px 16px',
                          border: travelParty === opt ? '1px solid #2c2416' : '1px solid rgba(44, 36, 22, 0.15)',
                          background: travelParty === opt ? '#2c2416' : '#fff',
                          color: travelParty === opt ? '#fff' : '#2c2416',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>What matters most?</label>
                  <textarea
                    placeholder="The food. The quiet. The shopping. An adventure. Tell us what you're looking for..."
                    value={priorities}
                    onChange={(e) => setPriorities(e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    background: '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'default' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                    marginTop: 8,
                  }}
                >
                  {submitting ? 'Sending...' : 'Build My Trip'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, color: '#2c2416', marginBottom: 12 }}>
                We're on it.
              </p>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: 'rgba(44, 36, 22, 0.6)', lineHeight: 1.7 }}>
                Your concierge will be in touch to refine the details. In the meantime, keep saving — every heart helps us build a better trip.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function MoroccoGuide() {
  useScrollDepth("/guides/morocco");
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getImageUrl, hasCustomImage } = useCustomImages();
  const { data: imageSlotsData } = useImageSlots();

  // Editorial product overlay state
  const [overlayData, setOverlayData] = useState<{ imageUrl: string; imageAlt: string; products: EditorialProduct[] } | null>(null);

  const getSlotImageUrl = (slotKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find((s: any) => s.key === slotKey);
      if (slot?.currentUrl) return slot.currentUrl;
    }
    const defaultSlot = IMAGE_SLOTS.find((s: any) => s.key === slotKey);
    return defaultSlot?.defaultUrl || `${BLOB_V2}/${slotKey}`;
  };

  const openEditorialOverlay = (slotKey: string, imageUrl: string, imageAlt: string) => {
    const products = EDITORIAL_PRODUCT_MAP[slotKey];
    if (products && products.length > 0) {
      setOverlayData({ imageUrl, imageAlt, products });
    }
  };

  // Render a product as an additional carousel slide inside PlaceImages.
  // Slides naturally inherit the carousel scroll mechanics on mobile/tablet.
  const renderProductTile = (p: EditorialProduct) => {
    const studioImg = p.genomeKey ? getShopImageUrl(p.genomeKey) : '';
    const imageUrl = studioImg || p.imageUrl || '';
    const bucket = p.bucket || 'Your Style';
    const pinType = p.pinType || 'style';
    return (
      <div
        key={p.id}
        className="product-tile"
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => openEditorialProductModal(p)}
      >
        <div className="product-tile-img">
          {imageUrl ? (
            <img src={imageUrl} alt={`${p.brand} ${p.name}`} />
          ) : (
            <div className="product-tile-placeholder">{p.name}</div>
          )}
          <div
            style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <PinButton
              itemType={pinType as any}
              itemId={p.id}
              sourceContext="morocco-guide-wardrobe"
              itemData={{
                title: `${p.brand} — ${p.name}`,
                bucket,
                sourceStory: 'Morocco',
                saveType: pinType,
                imageUrl,
                brand: p.brand,
                price: p.price || undefined,
                genomeKey: p.genomeKey,
                assetKey: p.genomeKey,
                storyTag: 'morocco',
              }}
              aestheticTags={[bucket.toLowerCase(), pinType, 'morocco']}
              size="sm"
            />
          </div>
        </div>
        <div className="product-tile-info">
          <p className="product-brand">{p.brand}</p>
          <p className="product-name">{p.name}</p>
          {p.price && <p className="product-price">{p.price}</p>}
        </div>
      </div>
    );
  };

  // Shared tap handler for editorial products — used by overlay AND by tile taps
  const openEditorialProductModal = (product: EditorialProduct, editorialContextUrl?: string) => {
    const genome = product.genomeKey ? getProductByKey(product.genomeKey) : undefined;
    const studioUrl = product.genomeKey ? getShopImageUrl(product.genomeKey) : '';
    setSelectedItem({
      id: product.id,
      title: product.name,
      bucket: product.bucket || 'Your Style',
      pinType: product.pinType || 'style',
      assetKey: product.id,
      storyTag: 'morocco',
      imageUrl: studioUrl || product.imageUrl,
      brand: genome?.brand || product.brand,
      price: genome?.price || product.price || undefined,
      shopUrl: genome && isShoppable(genome) ? genome.url : product.shopUrl || undefined,
      description: genome?.description,
      color: genome?.color,
      sizes: genome?.sizes,
      shopStatus: genome?.shop_status,
      genomeKey: product.genomeKey,
      editorialImageUrl: editorialContextUrl || product.imageUrl || undefined,
    });
    setDrawerOpen(true);
  };

  /* Genome-resolving product modal — same pattern as /concierge */
  const openProductModal = (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => {
    let resolvedGenomeKey = data.genomeKey;
    if (!resolvedGenomeKey && data.itemId) {
      const flowId = data.itemId.replace(/-(look|wardrobe)$/, '');
      const mapKey = FLOW_LOOK_GENOME_KEY[flowId] || SECTION_LOOK_GENOME_KEY[flowId];
      if (mapKey) resolvedGenomeKey = mapKey;
    }
    const genome = resolvedGenomeKey ? getProductByKey(resolvedGenomeKey) : undefined;
    const displayName = genome ? getProductDisplayName(genome) : data.title;
    const shopUrlResolved = genome && isShoppable(genome) ? genome.url : data.shopUrl;

    setSelectedItem({
      id: data.itemId,
      title: displayName,
      bucket: 'Your Style',
      pinType: data.pinType || 'look',
      assetKey: data.itemId,
      storyTag: 'morocco',
      imageUrl: data.imageUrl,
      brand: genome?.brand || data.brand,
      price: genome?.price || undefined,
      shopUrl: shopUrlResolved || undefined,
      description: genome?.description || data.description,
      color: genome?.color || undefined,
      sizes: genome?.sizes || undefined,
      shopStatus: genome?.shop_status || undefined,
      genomeKey: resolvedGenomeKey,
    });
    setDrawerOpen(true);
  };

  return (
    <div className="morocco-guide">

      {/* ═══ HERO ═══ */}
      <div className="guide-hero">
        <h1>MARRAKECH</h1>
        <div className="curator">A FIL DE VIE GUIDE</div>
        <div className="subtitle">Curated by Sharon Lombardo</div>
      </div>

      <div className="divider-double" />

      {/* HERO IMAGE */}
      <div className="hero-image">
        <img src="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/Marrakech%2C%20%40amanjena%20copy.jpeg" alt="Marrakech — Amanjena" />
      </div>

      {/* ═══ INTRO ═══ */}
      <div className="quote-block">
        <div className="intro-text">
          <p>Marrakech is one of my favorite places in the world.</p>
          <p>I&rsquo;ve been coming here for years &mdash; for Fil de Vie shoots, for sourcing, for long conversations in tiled courtyards that somehow stretch into evening. It&rsquo;s a city I return to again and again, and it never feels exhausted. It feels layered.</p>
          <p>There&rsquo;s a rhythm to it I love: the chaos of the medina, the quiet of a riad courtyard, the sharp desert light just outside the city. It&rsquo;s theatrical and intimate at the same time. If you let it.</p>
          <p>These are not the &ldquo;top 10 must-sees.&rdquo; They&rsquo;re the places I go back to &mdash; the gardens I still walk, the rooftops I still book, the shops I still browse, the rooms I still love staying in.</p>
          <p>Marrakech rewards curiosity. And return visits.</p>
        </div>
        <p className="bio">Sharon Lombardo is the founder of Fil De Vie and your host here at Fil De Vie Concierge</p>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: THE EXPERIENCE ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE EXPERIENCE</h2>
      </div>
      <div className="section-sub">Things to see and do</div>
      <div className="divider-double" />

      {/* Experience 1: Badi Palace */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-1-large.jpg`} alt="Badi Palace" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-main" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-large.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-1-small1.jpg`} alt="Badi Palace detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-detail" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-1-small2.jpg`} alt="Badi Palace moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-moment" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Badi Palace</h3>
          <div className="tagline">Ruins, scale, silence.</div>
          <div className="description">The 16th-century El Badi Palace is mostly ruins now &mdash; which is exactly why it&rsquo;s powerful. Vast sun-warmed walls, stork nests perched high above, and open courtyards that feel almost surreal against the blue sky. Go late afternoon when the light softens and the crowds thin. It&rsquo;s less about what&rsquo;s left and more about the space it creates.</div>
          <PlaceContact venueName="Badi Palace" address="Ksibat Nhass, Marrakech 40000" url="http://www.badipalace.com" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/exp-1-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-break" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-break.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
      <div className="editorial-caption">Orange blossom in bloom. That faint citrus-sweet scent in the air, drifting through the heat. Color everywhere, but the fragrance is what lingers.</div>

      {/* Editorial break — Gaia Dress in terracotta doorway (shoppable) */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-tile-1"); openEditorialOverlay("morocco-tile-1", url, "Black dress against terracotta"); }}>
        <img src={getSlotImageUrl("morocco-tile-1")} alt="Black dress against terracotta" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-editorial-gaia-doorway" itemData={{ title: "Gaia Dress", imageUrl: getSlotImageUrl("morocco-tile-1"), storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-tile-1"); openEditorialOverlay("morocco-tile-1", url, "Black dress against terracotta"); }} />
      </div>
      <div className="editorial-caption">Crisp black cotton against terracotta. The contrast is the point.</div>

      {/* Experience 2: Jardin Secret */}
      <div className="place-block reverse">
        <PlaceImages layout="c">
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/exp-2-left.jpg`} alt="Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-secret-left" itemData={{ title: "Jardin Secret", description: "A quiet medina escape.", imageUrl: `${IMG}/exp-2-left.jpg`, storyTag: "morocco", bookUrl: "http://lejardinsecretmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "garden"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/exp-2-right.jpg`} alt="Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-secret-right" itemData={{ title: "Jardin Secret", description: "A quiet medina escape.", imageUrl: `${IMG}/exp-2-right.jpg`, storyTag: "morocco", bookUrl: "http://lejardinsecretmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "garden"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Jardin Secret</h3>
          <div className="tagline">A quiet medina escape.</div>
          <div className="description">Hidden within the medina walls, Le Jardin Secret feels like stepping into a private courtyard from another century. Islamic architecture, carved cedar ceilings, and restored gardens that feel calm compared to the surrounding chaos. Climb the tower for a panoramic view &mdash; it&rsquo;s one of the most beautiful in the city.</div>
          <PlaceContact venueName="Jardin Secret" address="121 Rue Mouassine, Marrakech 40030" url="http://lejardinsecretmarrakech.com" instagramHandle="lejardinsecret" />
        </div>
      </div>

      {/* Editorial break — Alaïa Souk Coat & Desert Pant on stairs (shoppable) */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-tile-3"); openEditorialOverlay("morocco-tile-3", url, "Blush pink on sun-warmed clay"); }}>
        <img src={getSlotImageUrl("morocco-tile-3")} alt="Blush pink on sun-warmed clay" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-editorial-alaia-stairs" itemData={{ title: "Souk Coat & Desert Pant", imageUrl: getSlotImageUrl("morocco-tile-3"), storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-tile-3"); openEditorialOverlay("morocco-tile-3", url, "Blush pink on sun-warmed clay"); }} />
      </div>
      <div className="editorial-caption">Blush pink against sun-warmed clay. Soft, but never sweet. The color almost disappears into the earth &mdash; and that&rsquo;s the beauty of it.</div>

      {/* Experience 3: Agafay Desert Camp */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-3-large.jpg`} alt="Agafay Desert Camp" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-main" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-3-small1.jpg`} alt="Agafay detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-detail" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-3-small2.jpg`} alt="Agafay moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-moment" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Agafay Desert Camp</h3>
          <div className="tagline">Desert drama without the five-hour drive.</div>
          <div className="description">Agafay isn&rsquo;t the Sahara &mdash; it&rsquo;s stone desert &mdash; but that&rsquo;s its appeal. Less clich&eacute;, more lunar landscape. An overnight camp gives you that endless horizon feeling without committing to a multi-day trek. Go for sunset. Stay for dinner under the stars. It&rsquo;s theatrical in the best way.</div>
          <PlaceContact venueName="Agafay Desert Camp" address="Agafay Desert, approx. 45 minutes from Marrakech" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/exp-3-break-v2.jpeg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-break" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-break-v2.jpeg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
      <div className="editorial-caption">Always a rooftop at sunset.</div>

      {/* Experience 4: Jardin Majorelle */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-4-large.jpg`} alt="Jardin Majorelle" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-main" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-large.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-4-small1.jpg`} alt="Majorelle detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-detail" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-small1.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-4-small2.jpg`} alt="Majorelle moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-moment" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-small2.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Jardin Majorelle</h3>
          <div className="tagline">Cobalt blue and exquisite beauty with a side of Saint Laurent</div>
          <div className="description">Yes, it&rsquo;s popular. Yes, it&rsquo;s worth it. The Yves Saint Laurent&ndash;owned garden is an immersion in electric Majorelle blue, lush cactus forms, and quiet pathways. Book the first entry time of the day &mdash; it gets crowded quickly. Pair it with the YSL Museum next door if you have even a passing interest in fashion or design.</div>
          <PlaceContact venueName="Jardin Majorelle" address="Rue Yves St Laurent, Marrakech 40090" url="http://jardinmajorelle.com" instagramHandle="jardinmajorelle" />
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: EAT & DRINK ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>EAT &amp; DRINK</h2>
      </div>
      <div className="section-sub">Restaurants, caf&eacute;s, bars</div>
      <div className="divider-double" />

      {/* Eat 1: Nomad */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-1-large.jpg`} alt="Nomad" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-main" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-large.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-1-small1.jpg`} alt="Nomad detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-detail" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-1-small2.jpg`} alt="Nomad moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-moment" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Nomad</h3>
          <div className="tagline">Rooftop views and modern Moroccan.</div>
          <div className="description">Nomad balances local flavors with modern presentation. It&rsquo;s popular but reliable. Sit upstairs. Order small plates and watch the medina shift into evening.</div>
          <PlaceContact venueName="Nomad Marrakech" address="1 Derb Aarjane, Rahba Lakdima, Marrakech 40000" url="http://nomadmarrakech.com" instagramHandle="nomadmarrakech" />
        </div>
      </div>

      {/* Editorial break — El Fenn rooftop dinner (atmosphere) */}
      <div className="full-image" style={{ position: "relative" }}>
        <img src={getSlotImageUrl("morocco-experience-1")} alt="El Fenn rooftop dinner" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-editorial-elfenn-rooftop" itemData={{ title: "El Fenn rooftop", description: "Gold light pooling over stone and olive branches.", imageUrl: getSlotImageUrl("morocco-experience-1"), storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "destination", "restaurant"]} size="sm" /></div>
      </div>
      <div className="editorial-caption">Terracotta walls late afternoon.</div>

      {/* Eat 2: Cafe Bacha */}
      <div className="place-block reverse">
        <PlaceImages layout="c">
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-2-left.jpg`} alt="Cafe Bacha" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-left" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-left.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-2-right.jpg`} alt="Cafe Bacha" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-right" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-right.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Caf&eacute; Bacha</h3>
          <div className="tagline">Decadent morning ritual.</div>
          <div className="description">Located inside Dar el Bacha Palace, Caf&eacute; Bacha is all marble, gold accents, and endless coffee options. It&rsquo;s theatrical &mdash; but charming. Go early to avoid lines and sit inside if you can. Order the pastries and commit.</div>
          <PlaceContact venueName="Café Bacha" address="Dar El Bacha Palace, Rue Fatima Zahra, Medina, Marrakech 40570" url="http://bachacoffee.com" instagramHandle="bachacoffee" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/eat-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-break" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-break.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>
      <div className="editorial-caption">Decadent morning ritual at Caf&eacute; Bacha.</div>

      {/* Eat 3: La Famille */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-3-large.jpg`} alt="La Famille" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-main" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-3-small1.jpg`} alt="La Famille detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-detail" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-3-small2.jpg`} alt="La Famille moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-moment" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>La Famille</h3>
          <div className="tagline">Vegetarian and unexpectedly chic.</div>
          <div className="description">Tucked away in the medina, La Famille feels like a secret garden lunch. The menu is seasonal, simple, and beautiful. It&rsquo;s light, fresh, and a welcome pause from heavier meals.</div>
          <PlaceContact venueName="La Famille" address="34 Derb Jdid, Sidi Abdelaziz, Medina, Marrakesh 40500" instagramHandle="lafamillemarrakech" />
        </div>
      </div>

      {/* Editorial break — Red caftan on El Fenn tile (shoppable) */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-motion-1"); openEditorialOverlay("morocco-motion-1", url, "Red caftan on layered tile"); }}>
        <img src={getSlotImageUrl("morocco-motion-1")} alt="Red caftan on layered tile" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-editorial-red-caftan" itemData={{ title: "Long Caftan Dress", imageUrl: getSlotImageUrl("morocco-motion-1"), storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-motion-1"); openEditorialOverlay("morocco-motion-1", url, "Red caftan on layered tile"); }} />
      </div>
      <div className="editorial-caption">El Fenn. A flash of red against layered tile. Pattern on pattern &mdash; and then that one bold interruption. Dress by Fil De Vie.</div>

      {/* Eat 4: Le Jardin de Lotus */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-4-large.jpg`} alt="Le Jardin de Lotus" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-main" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-large.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-4-small1.jpg`} alt="Le Jardin de Lotus detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-detail" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-small1.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-4-small2.jpg`} alt="Le Jardin de Lotus moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-moment" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-small2.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Le Jardin de Lotus</h3>
          <div className="tagline">Relaxed glamour</div>
          <div className="description">A more contemporary rooftop option with cocktails and Moroccan-Asian fusion plates. Come at sunset. Stay if the mood is right.</div>
          <PlaceContact venueName="Le Jardin" address="Dar el Bacha District, 9 Derb Sidi Ali Ben Hamdouche, Medina, Marrakesh 40000" url="https://lejardindelotus.com" />
        </div>
      </div>

      {/* Eat 5: La Mamounia */}
      <div className="place-block">
        <PlaceImages layout="c">
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-5-left.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-left" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-left.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-5-right.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-right" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-right.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>La Mamounia &mdash; Evening Drinks</h3>
          <div className="tagline">Golden hour, perfected.</div>
          <div className="description">You don&rsquo;t have to stay here to enjoy it. Come for a pre-dinner drink in the Churchill Bar or on the terrace. It&rsquo;s polished, yes &mdash; but the atmosphere is undeniable. Lean into it.</div>
          <PlaceContact venueName="La Mamounia" address="Avenue Bab Jdid, Marrakesh 40040" url="http://www.mamounia.com" instagramHandle="mamouniamarrakech" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/eat-5-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-break" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-break.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>
      <div className="editorial-caption">The glamour of old school Marrakech evening.</div>

      {/* Eat 6: Dar Yacout */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-6-large.jpg`} alt="Dar Yacout" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-main" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-6-small1.jpg`} alt="Dar Yacout detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-detail" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-6-small2.jpg`} alt="Dar Yacout moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-moment" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Dar Yacout</h3>
          <div className="tagline">Traditional Moroccan, done properly.</div>
          <div className="description">A multi-course feast in a traditional riad setting &mdash; lantern light, tiled courtyards, live musicians. It&rsquo;s over-the-top in the very best way. Go hungry. Don&rsquo;t rush.</div>
          <PlaceContact venueName="Dar Yacout" address="79 Derb Sidi Ahmed Soussi, Bab Doukkala, Marrakesh 40000" />
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: SHOP LOCAL ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>SHOP LOCAL</h2>
      </div>
      <div className="section-sub">Artisans, boutiques, makers</div>
      <div className="divider-double" />

      {/* Shop 1: The Souks */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-1-large.jpg`} alt="The Souks" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-main" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-1-small1.jpg`} alt="The Souks detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-detail" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-1-small2.jpg`} alt="The Souks moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-moment" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>The Souks &mdash; Of Course</h3>
          <div className="tagline">Start here. Then wander.</div>
          <div className="description">
            The souks aren&rsquo;t something to check off &mdash; they&rsquo;re something to get lost in. Brass hammered by hand. Baskets woven floor to ceiling. Leather dyed in colors you&rsquo;ll wish you wore more often. If you want to narrow it down:
            <ul>
              <li>Souk Semmarine for textiles and leather.</li>
              <li>Souk El Attarine for spices and perfume.</li>
              <li>Souk Haddadine for metalwork.</li>
              <li>Souk Cherratine for serious leather goods.</li>
            </ul>
            Don&rsquo;t rush. Don&rsquo;t panic. Let it feel overwhelming for a minute. Then it starts to make sense.
          </div>
          <PlaceContact venueName="Medina Marrakesh" address="Medina of Marrakesh, near Jemaa el-Fnaa Square" />
        </div>
      </div>

      {/* Editorial break — Este Dress with fringe bag against terracotta (shoppable) */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-tile-5"); openEditorialOverlay("morocco-tile-5", url, "Black dress with fringe bag"); }}>
        <img src={getSlotImageUrl("morocco-tile-5")} alt="Black dress with fringe bag" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-editorial-este-dress" itemData={{ title: "Este Dress", imageUrl: getSlotImageUrl("morocco-tile-5"), storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-tile-5"); openEditorialOverlay("morocco-tile-5", url, "Black dress with fringe bag"); }} />
      </div>
      <div className="editorial-caption">Black dress &mdash; from the souks to rooftop dinners. Dress by Fil De Vie.</div>

      {/* Shop 2: El Fenn Gift Shop */}
      <div className="place-block reverse">
        <PlaceImages layout="c">
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/shop-2-left.jpg`} alt="El Fenn Gift Shop" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-left" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-left.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/shop-2-right.jpg`} alt="El Fenn Gift Shop" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-right" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-right.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>El Fenn Gift Shop</h3>
          <div className="tagline">Actually chic souvenirs.</div>
          <div className="description">Not the usual tourist trinkets. The El Fenn boutique curates ceramics, textiles, books, and home pieces that feel elevated. It&rsquo;s where you find something you&rsquo;ll genuinely keep &mdash; not just pack.</div>
          <PlaceContact venueName="El Fenn" address="2 Derb Moulay Abdellah Ben Hezzian, Medina, Marrakesh 40000" url="http://www.elfenn.com" instagramHandle="el_fenn_marrakech" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/shop-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-break" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-break.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
      <div className="editorial-caption">Pattern, pleasure, warmth, and light.</div>

      {/* Shop 3: Mustapha Blaoui */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-3-large.jpg`} alt="Mustapha Blaoui" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-main" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-3-small1.jpg`} alt="Mustapha Blaoui detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-detail" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-3-small2.jpg`} alt="Mustapha Blaoui moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-moment" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Mustapha Blaoui</h3>
          <div className="tagline">Treasure hunting at scale.</div>
          <div className="description">If you love objects &mdash; lamps, ceramics, carved doors, vintage finds &mdash; this is the place. It&rsquo;s layered and slightly dusty and entirely addictive. You&rsquo;ll want to ship things home. You probably should.</div>
          <PlaceContact venueName="Mustapha Blaoui" address="144 Arset Aouzal Rd, Bab Doukkala, Marrakesh 40000" instagramHandle="mustaphablaouimarrakech" />
        </div>
      </div>

      {/* Shop 4: Max & Jan */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-4-large.jpg`} alt="Max & Jan" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-main" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-large.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-4-small1.jpg`} alt="Max & Jan detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-detail" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-4-small2.jpg`} alt="Max & Jan moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-moment" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Max &amp; Jan</h3>
          <div className="tagline">Modern Marrakech.</div>
          <div className="description">A contemporary boutique blending Moroccan craftsmanship with European silhouettes. Graphic prints, sharp tailoring, and pieces that travel well. It&rsquo;s a smart edit if you want something local but wearable back home.</div>
          <PlaceContact venueName="Max &amp; Jan" address="14 Rue Amsefah, Marrakech 40000" url="http://www.maxandjan.com" instagramHandle="maxandjan" />
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ CURATE PROMPT ═══ */}
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        maxWidth: 420,
        margin: '0 auto',
      }}>
        <p style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: '15px',
          fontStyle: 'italic',
          color: 'rgba(26, 26, 22, 0.5)',
          lineHeight: 1.7,
          marginBottom: '16px',
        }}>
          Build a Marrakech edit from what you've saved. Come back anytime — it changes as your Suitcase grows.
        </p>
        <Link href="/suitcase?curate=true">
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(26, 26, 22, 0.35)',
            borderBottom: '1px solid rgba(26, 26, 22, 0.15)',
            paddingBottom: '2px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}>
            Curate for Me →
          </span>
        </Link>
      </div>

      {/* ═══ SECTION: THE STAY ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE STAY</h2>
      </div>
      <div className="section-sub">Hotels, riads, retreats</div>
      <div className="divider-double" />

      {/* Editorial break — El Fenn ruby interior (atmosphere, BOOK link) */}
      <div className="full-image" style={{ position: "relative" }}>
        <img src={getSlotImageUrl("morocco-texture-1")} alt="El Fenn ruby interior" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-editorial-elfenn-ruby" itemData={{ title: "El Fenn", description: "Layered ruby red, saffron, emerald, tile, velvet.", imageUrl: getSlotImageUrl("morocco-texture-1"), storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div>
      </div>
      <div className="editorial-caption">El Fenn. Layered ruby red, saffron, emerald, tile, velvet. It&rsquo;s saturated and fearless, but somehow still composed.</div>

      {/* Stay 1: El Fenn */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-1-large.jpg`} alt="El Fenn" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-main" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-large.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-1-small1.jpg`} alt="El Fenn detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-detail" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-1-small2.jpg`} alt="El Fenn moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-moment" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>El Fenn</h3>
          <div className="tagline">Color, art, and rooftop sunsets.</div>
          <div className="description">Owned by Vanessa Branson, El Fenn is Marrakech at its most curated &mdash; bold colors, modern art, layered textiles. The rooftop pool at sunset is reason enough to stay. It&rsquo;s lively but intimate, and the design feels intentional without being overly staged. <em>My favorite place to stay &mdash; close to everything you&rsquo;ll want to do.</em></div>
          <PlaceContact venueName="El Fenn" address="2 Derb Moulay Abdellah Ben Hezzian, Marrakech 40000" url="http://www.elfenn.com" instagramHandle="el_fenn_marrakech" />
        </div>
      </div>

      {/* Stay 2: Riad Jardin Secret */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-2-large.jpg`} alt="Riad Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-main" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-large.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-2-small1.jpg`} alt="Riad Jardin Secret detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-detail" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-2-small2.jpg`} alt="Riad Jardin Secret moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-moment" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Riad Jardin Secret</h3>
          <div className="tagline">Intimate, traditional, serene.</div>
          <div className="description">Tucked inside the medina, this riad offers the opposite of hotel grandeur &mdash; quiet courtyards, carved wood, and a sense of privacy. It feels personal and atmospheric. Perfect if you want immersion over spectacle.</div>
          <PlaceContact venueName="Riad Jardin Secret" address="43-46 Arset Aouzal Road, Bab Doukkala, Medina, Marrakesh 40000" url="http://www.riad-jardinsecret.com" instagramHandle="riadjardinsecret" />
        </div>
      </div>

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/stay-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-break" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-break.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
      <div className="editorial-caption">El Fenn Hotel &mdash; graphic tile, citrus trees, rhythmic and alive.</div>

      {/* Stay 3: La Mamounia */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-3-large.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-main" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-large.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-3-small1.jpg`} alt="La Mamounia detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-detail" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-small1.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-3-small2.jpg`} alt="La Mamounia moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-moment" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-small2.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>La Mamounia</h3>
          <div className="tagline">Iconic. Unapologetically grand.</div>
          <div className="description">La Mamounia is not understated &mdash; it&rsquo;s cinematic, historic, and slightly over the top in the best way. The gardens alone are worth walking through. Stay if you want full classic Moroccan luxury. Or just come for drinks at sunset and let the tiled corridors and candlelight do the rest.</div>
          <PlaceContact venueName="La Mamounia" address="Avenue Bab Jdid, Marrakech 40040" url="http://mamounia.com" instagramHandle="mamouniamarrakech" />
        </div>
      </div>

      {/* Stay 4: Amanjena */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Amanjena poolside"); }}>
            <img src={getSlotImageUrl("morocco-style-1")} alt="Amanjena" />
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-main" itemData={{ title: "Amanjena", description: "Aman's Marrakech. Pink marble, reflecting pools, absolute silence.", imageUrl: getSlotImageUrl("morocco-style-1"), storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div>
            <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Amanjena poolside"); }} />
          </div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${BLOB_V2}/morocco-texture-1`} alt="Amanjena detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-detail" itemData={{ title: "Amanjena", description: "Pink marble, reflecting pools, absolute silence.", imageUrl: `${BLOB_V2}/morocco-texture-1`, storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${BLOB_V2}/morocco-experience-1`} alt="Amanjena atmosphere" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-moment" itemData={{ title: "Amanjena", description: "Pink marble, reflecting pools, absolute silence.", imageUrl: `${BLOB_V2}/morocco-experience-1`, storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
        </PlaceImages>
        <div className="place-info">
          <h3>Amanjena</h3>
          <div className="tagline">Aman&rsquo;s Marrakech. Pink marble, reflecting pools, absolute silence.</div>
          <div className="description">Ten minutes from the Medina but it feels like another country. Amanjena is where you go when you want to disappear &mdash; in the best way. The pavilions face reflecting pools that mirror the Atlas Mountains. The gardens are almost absurdly peaceful. Everything is rose-toned and unhurried. If you can, book a maison with a private pool. You won&rsquo;t leave the property for the first two days. You won&rsquo;t want to.</div>
          <PlaceContact venueName="Amanjena" address="Route de Ouarzazate, Km 12, Marrakech 40000" url="https://www.aman.com/resorts/amanjena" instagramHandle="aman" />
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: THE WARDROBE ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE WARDROBE</h2>
      </div>
      <div className="section-sub">What to wear &mdash; curated looks + shoppable pieces</div>
      <div className="divider-double" />

      {/* Editorial break — Wardrobe opener: YSL Bikini in Amanjena doorway (shoppable) */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Black bikini in Amanjena doorway"); }}>
        <img src={getSlotImageUrl("morocco-style-1")} alt="Black bikini in Amanjena doorway" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-editorial-ysl-bikini" itemData={{ title: "LouLou Bikini", imageUrl: getSlotImageUrl("morocco-style-1"), storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Black bikini in Amanjena doorway"); }} />
      </div>
      <div className="editorial-caption">Amanjena, Marrakech. Desert-toned walls, long shadows, stillness. A black bathing suit against all that sand and clay feels moody and intentional.</div>

      {/* Wardrobe 1: Day in the Medina */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-large", `${IMG}/ward-1-large.jpg`, "Day in the Medina look")}><img src={`${IMG}/ward-1-large.jpg`} alt="Day in the Medina look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-main" itemData={{ title: "Day in the Medina", description: "Medina uniform.", imageUrl: `${IMG}/ward-1-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-large", `${IMG}/ward-1-large.jpg`, "Day in the Medina look")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-small1", `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, "Bottega Veneta Kalimero Bag")}><img src={`${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`} alt="Bottega Veneta Kalimero Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-detail" itemData={{ title: "Bottega Veneta Kalimero Bag", imageUrl: `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-small1", `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, "Bottega Veneta Kalimero Bag")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-small2", `${IMG}/ward-1-small2_bulgari_necklace.jpg`, "Bulgari Necklace")}><img src={`${IMG}/ward-1-small2_bulgari_necklace.jpg`} alt="Bulgari Necklace" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-moment" itemData={{ title: "Bulgari Necklace", imageUrl: `${IMG}/ward-1-small2_bulgari_necklace.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-small2", `${IMG}/ward-1-small2_bulgari_necklace.jpg`, "Bulgari Necklace")} /></div>
          {DAY_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>Day in the Medina</h3>
          <div className="tagline">Medina uniform.</div>
          <div className="description">Linen you can breathe in. Stripes that feel intentional but not precious. Flat sandals because you&rsquo;ll be walking more than you expect. Gold, but not too much. Hair slightly undone. It moves with you &mdash; which is the whole point.</div>
        </div>
      </div>

      {/* Wardrobe 2: Riad Evenings */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-large", `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, "Riad Evenings look")}><img src={`${IMG}/ward-2-large_fdv_isadora_dress.jpg`} alt="Riad Evenings look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-main" itemData={{ title: "Riad Evenings", description: "Marrakech does drama.", imageUrl: `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-large", `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, "Riad Evenings look")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-small1", `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, "Chloé Wristlette Bag")}><img src={`${IMG}/ward-2-small1_chloe_wristless_bag.jpg`} alt="Chloé Wristlette Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-detail" itemData={{ title: "Chloé Wristlette Bag", imageUrl: `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-small1", `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, "Chloé Wristlette Bag")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-small2", `${IMG}/ward-2-small2_poppyking_red.jpg`, "PoppyKing Lipstick")}><img src={`${IMG}/ward-2-small2_poppyking_red.jpg`} alt="PoppyKing Lipstick" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-moment" itemData={{ title: "PoppyKing Lipstick", imageUrl: `${IMG}/ward-2-small2_poppyking_red.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-small2", `${IMG}/ward-2-small2_poppyking_red.jpg`, "PoppyKing Lipstick")} /></div>
          {EVE_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>Riad Evenings</h3>
          <div className="tagline">Marrakech does drama. You might as well participate.</div>
          <div className="description">Lantern light, warm stone, a drink resting on the table while you lean in. Black feels intentional here. Slightly dangerous in candlelight. In a good way. You&rsquo;ll stay longer than planned. You won&rsquo;t regret it.</div>
        </div>
      </div>

      {/* Wardrobe 3: What Travels Well — accessories + beauty (Column Dress image as hero) */}
      <div className="place-block">
        <PlaceImages layout="a">
          <div
            className="img-large"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => openEditorialOverlay("morocco-object-1", getSlotImageUrl("morocco-object-1"), "What Travels Well")}
          >
            <img src={getSlotImageUrl("morocco-object-1")} alt="What Travels Well" />
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
              <PinButton
                itemType="style"
                itemId="guide-morocco-travel-well-main"
                itemData={{ title: "What Travels Well", description: "The pieces between the outfits.", imageUrl: getSlotImageUrl("morocco-object-1"), storyTag: "morocco" }}
                sourceContext="morocco-guide"
                aestheticTags={["morocco", "travel", "accessories", "beauty"]}
                size="sm"
              />
            </div>
            <ShoppableIndicator onClick={() => openEditorialOverlay("ward-3-large", getSlotImageUrl("morocco-object-1"), "What Travels Well")} />
          </div>
          {TRAVEL_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>What Travels Well</h3>
          <div className="tagline">The pieces between the outfits.</div>
          <div className="description">Sunscreen you&rsquo;ll actually reapply. A scarf that works as a wrap, a cover-up, and a headscarf in the medina. Gold that catches candlelight. These are the things you&rsquo;ll reach for every day &mdash; the ones that make the rest of it work.</div>
        </div>
      </div>

      {/* SHOP THE FULL EDIT link */}
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <Link href="/shop">
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: '#c9a84c',
            borderBottom: '1px solid #c9a84c',
            paddingBottom: '2px',
            cursor: 'pointer',
          }}>
            Shop the Full Edit →
          </span>
        </Link>
      </div>

      <hr className="divider" />

      {/* ═══ GUIDE MAP ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>GUIDE MAP</h2>
      </div>
      <div className="divider-double" />

      <div className="guide-map">
        <div className="map-placeholder">
          <span>Interactive map &mdash; all 17 locations pinned</span>
        </div>
      </div>

      <hr className="divider" />

      {/* Shop the Full Edit link */}
      <div style={{ textAlign: 'center', padding: '32px 24px' }}>
        <Link href="/shop?destination=morocco">
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            borderBottom: '1px solid #c9a84c',
            paddingBottom: 2,
            cursor: 'pointer',
          }}>
            Shop the Full Edit →
          </span>
        </Link>
      </div>

      {/* ═══ TRIP TEASER + BRIEF FORM — "Want yours?" conversion moment ═══ */}
      <TripTeaserAndBriefForm />

      {/* ═══ FOOTER ═══ */}
      <div className="guide-footer">
        <div className="closing">Some places don&rsquo;t need to be explained. They need to be felt.</div>
        <div style={{ textAlign: 'center', padding: '16px 24px 0', maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lora, serif', fontSize: 14, fontStyle: 'italic', color: '#999', letterSpacing: '0.02em' }}>
            Love this? Tap the share icon above &mdash; your friends will thank you.
          </p>
        </div>
        <div className="brand-mark">FDV Destination Guide &mdash; Fil de Vie Concierge</div>
      </div>

      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="current"
      />

      {/* Editorial Product Overlay — Level 2 */}
      {overlayData && (
        <EditorialProductOverlay
          editorialImageUrl={overlayData.imageUrl}
          editorialImageAlt={overlayData.imageAlt}
          products={overlayData.products}
          onClose={() => setOverlayData(null)}
          onProductTap={(product) => {
            const editorialUrl = overlayData.imageUrl;
            // Don't close overlay — keep it underneath the modal
            openEditorialProductModal(product, editorialUrl);
          }}
        />
      )}
    </div>
  );
}
