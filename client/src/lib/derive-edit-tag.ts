type SavedItemLike = {
  editTag?: string | null;
  storyTag?: string | null;
  sourceContext?: string | null;
  itemId?: string | null;
  metadata?: {
    sourceStory?: string;
    [key: string]: any;
  } | null;
};

const STORY_TO_EDIT: Record<string, string> = {
  'morocco': 'morocco-edit',
  'hydra': 'hydra-edit',
  'slow-travel': 'slow-travel-edit',
  'retreat': 'retreat-edit',
  'new-york': 'new-york-edit',
  'opening': 'opening-edit',
  'todays-edit': 'opening-edit',
};

const METADATA_STORY_MAP: Record<string, string> = {
  'Morocco': 'morocco-edit',
  'Hydra': 'hydra-edit',
  'Slow Travel': 'slow-travel-edit',
  'Retreat': 'retreat-edit',
  'New York': 'new-york-edit',
};

export function deriveEditTag(save: SavedItemLike): string | null {
  if (save.editTag) return save.editTag;
  
  if (save.storyTag && STORY_TO_EDIT[save.storyTag]) {
    return STORY_TO_EDIT[save.storyTag];
  }
  
  if (save.sourceContext) {
    const ctx = save.sourceContext.toLowerCase();
    if (ctx.includes('morocco')) return 'morocco-edit';
    if (ctx.includes('hydra')) return 'hydra-edit';
    if (ctx.includes('slow_travel') || ctx.includes('slow-travel')) return 'slow-travel-edit';
    if (ctx.includes('retreat')) return 'retreat-edit';
    if (ctx.includes('opening') || ctx.includes('todays_edit')) return 'opening-edit';
    if (/(^|[_-])(ny|nyc|newyork|new_york)([_-]|$)/.test(ctx)) {
      return 'new-york-edit';
    }
  }
  
  if (save.itemId) {
    if (save.itemId.startsWith('morocco-') || save.itemId.startsWith('d1-') || save.itemId.startsWith('d2-') || 
        save.itemId.startsWith('d3-') || save.itemId.startsWith('d4-') || save.itemId.startsWith('d5-') ||
        save.itemId.startsWith('d6-') || save.itemId.startsWith('d7-') || save.itemId.startsWith('d8-')) {
      return 'morocco-edit';
    }
    if (save.itemId.startsWith('hydra-')) return 'hydra-edit';
    if (save.itemId.startsWith('slow-') || save.itemId.startsWith('slow-travel-')) return 'slow-travel-edit';
    if (save.itemId.startsWith('retreat-')) return 'retreat-edit';
    if (save.itemId.startsWith('ny-') || save.itemId.startsWith('newyork-')) return 'new-york-edit';
    if (save.itemId.startsWith('opening-')) return 'opening-edit';
  }
  
  if (save.metadata?.sourceStory && METADATA_STORY_MAP[save.metadata.sourceStory]) {
    return METADATA_STORY_MAP[save.metadata.sourceStory];
  }
  
  return null;
}
