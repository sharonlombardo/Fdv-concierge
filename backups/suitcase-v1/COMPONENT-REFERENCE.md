# Suitcase System - Component Reference v1

This backup contains all the files that make up the Suitcase system, including:
- How items are saved (PinButton, SuitcaseButton)
- How items are displayed (suitcase.tsx, detail-drawer.tsx)
- How items are categorized and mapped (derive-edit-tag.ts, SAVE_TYPE_TO_CATEGORY)

## File Structure

```
backups/suitcase-v1/
├── suitcase.tsx           # Main suitcase page
├── pin-button.tsx         # Pin/save button component
├── suitcase-button.tsx    # Suitcase/cart button component
├── detail-drawer.tsx      # Item detail drawer/modal
├── derive-edit-tag.ts     # Edit tag derivation logic
└── COMPONENT-REFERENCE.md # This file
```

---

## Category Mappings

### SAVE_TYPE_TO_CATEGORY
Maps item types to suitcase category tabs:

| Item Type | Category Tab |
|-----------|--------------|
| look | style (Your Style) |
| style | style |
| accessory | style |
| wardrobe | style |
| product | style |
| image | travel-destinations |
| inspire | travel-destinations |
| scene | travel-destinations |
| cover | travel-destinations |
| destination | travel-destinations |
| place | travel-destinations |
| feature | travel-destinations |
| inspiration | state-of-mind |
| quote | state-of-mind |
| mood | state-of-mind |
| texture | state-of-mind |
| experience | experiences |
| object | items (Objects of Desire) |
| item | items |
| article | culture |
| culture | culture |
| ritual | daily-rituals |
| edit | my-edits |

### Edit Tag Mappings (derive-edit-tag.ts)
Maps story tags to edit cards:

| Story Tag | Edit Card |
|-----------|-----------|
| morocco | morocco-edit |
| hydra | hydra-edit |
| slow-travel | slow-travel-edit |
| retreat | retreat-edit |
| new-york | new-york-edit |
| opening | opening-edit |
| todays-edit | opening-edit |

---

## Category Tabs

```typescript
const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "travel-destinations", label: "Travel/Destinations" },
  { id: "style", label: "Your Style" },
  { id: "state-of-mind", label: "State of Mind" },
  { id: "items", label: "Objects of Desire" },
  { id: "daily-rituals", label: "Daily Rituals" },
  { id: "culture", label: "Culture" },
  { id: "experiences", label: "Experiences" },
  { id: "my-edits", label: "My Edits" },
];
```

---

## Edit Cards

```typescript
const EDIT_CARDS = [
  { id: "morocco-edit", name: "Morocco Edit", storyTag: "morocco", color: "bg-amber-100 dark:bg-amber-900/30" },
  { id: "hydra-edit", name: "Hydra Edit", storyTag: "hydra", color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "slow-travel-edit", name: "Slow Travel Edit", storyTag: "slow-travel", color: "bg-stone-100 dark:bg-stone-800/50" },
  { id: "retreat-edit", name: "Retreat Edit", storyTag: "retreat", color: "bg-green-100 dark:bg-green-900/30" },
  { id: "new-york-edit", name: "New York Edit", storyTag: "new-york", color: "bg-slate-100 dark:bg-slate-800/50" },
  { id: "opening-edit", name: "Today's Edit", storyTag: "opening", color: "bg-rose-100 dark:bg-rose-900/30" },
];
```

---

## SavedItem Type Structure

```typescript
type SavedItem = {
  id: number;
  itemType: string;
  itemId: string;
  sourceContext: string;
  aestheticTags: string[];
  metadata: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    purchaseIntent?: boolean;
    [key: string]: any;
  };
  savedAt: number;
  editionTag?: string;
  storyTag?: string;
  editTag?: string;
  purchaseStatus?: string;
  title?: string;
  assetUrl?: string;
};
```

---

## API Endpoints

### GET /api/saves
Returns all saved items for the current user.

### POST /api/saves
Creates a new saved item.

Request body:
```json
{
  "itemType": "look",
  "itemId": "unique-item-id",
  "sourceContext": "morocco_editorial",
  "aestheticTags": ["morocco", "wardrobe", "style"],
  "metadata": { ... },
  "savedAt": 1234567890,
  "editionTag": "morocco-2026",
  "storyTag": "morocco",
  "editTag": "morocco-editorial",
  "title": "Item Title",
  "assetUrl": "data:image/jpeg;base64,..."
}
```

### DELETE /api/saves/:itemId
Removes a saved item by itemId.

### PATCH /api/saves/:itemId
Updates a saved item (e.g., purchaseStatus).

### GET /api/saves/check/:itemId
Checks if an item is already pinned.

---

## Image URL Priority

When displaying saved items, images are resolved in this order:
1. `save.assetUrl` (primary - stored at save time)
2. `save.metadata?.imageUrl` (fallback)

When saving items, the assetUrl is set from:
1. `itemData.assetUrl` (from PinButton props)
2. `itemData.imageUrl` (fallback)

---

## Source Labels

```typescript
function getSourceLabel(sourceContext: string): string {
  if (sourceContext.includes("morocco") || sourceContext.includes("itinerary")) {
    return "from Morocco";
  }
  if (sourceContext.includes("current")) {
    return "from The Current";
  }
  if (sourceContext.includes("todays_edit") || sourceContext.includes("opening")) {
    return "from Today's Edit";
  }
  if (sourceContext.includes("destinations")) {
    return "from Destinations";
  }
  if (sourceContext.includes("packing")) {
    return "from Packing";
  }
  return "";
}
```

---

## Complete Code Files

### suitcase.tsx
See: `backups/suitcase-v1/suitcase.tsx`

### pin-button.tsx
See: `backups/suitcase-v1/pin-button.tsx`

### suitcase-button.tsx
See: `backups/suitcase-v1/suitcase-button.tsx`

### detail-drawer.tsx
See: `backups/suitcase-v1/detail-drawer.tsx`

### derive-edit-tag.ts
See: `backups/suitcase-v1/derive-edit-tag.ts`
