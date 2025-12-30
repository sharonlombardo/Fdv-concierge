import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, X, Tag, Trash2, Upload, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { ImageLibraryItem } from '@shared/schema';

const SUGGESTED_TAGS = [
  // Locations
  'marrakech', 'atlas', 'essaouira', 'agafay', 'desert', 'medina', 'riad',
  // Times
  'morning', 'afternoon', 'evening', 'night', 'sunset', 'sunrise',
  // Activities
  'dining', 'travel', 'architecture', 'shopping', 'spa', 'nature', 'culture', 'adventure',
  // Moods
  'peaceful', 'vibrant', 'luxury', 'romantic', 'relaxed',
  // Types
  'landscape', 'interior', 'food', 'portrait', 'street', 'detail'
];

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'location', label: 'Location' },
  { value: 'activity', label: 'Activity' },
  { value: 'wardrobe', label: 'Wardrobe/Style' },
  { value: 'cover', label: 'Cover/Hero' },
];

export default function ImageLibrary() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState<{
    imageUrl: string;
    name: string;
    tags: string[];
    category: string;
    priority: number;
  }>({
    imageUrl: '',
    name: '',
    tags: [],
    category: 'general',
    priority: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images = [], isLoading } = useQuery<ImageLibraryItem[]>({
    queryKey: ['/api/library'],
  });

  const addImageMutation = useMutation({
    mutationFn: async (data: typeof newImage) => {
      return apiRequest('POST', '/api/library', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/library'] });
      setIsAddDialogOpen(false);
      setNewImage({ imageUrl: '', name: '', tags: [], category: 'general', priority: 0 });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/library/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/library'] });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewImage(prev => ({
        ...prev,
        imageUrl: base64,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !newImage.tags.includes(normalizedTag)) {
      setNewImage(prev => ({ ...prev, tags: [...prev.tags, normalizedTag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setNewImage(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const filteredImages = images.filter(img => {
    if (filterCategory !== 'all' && img.category !== filterCategory) return false;
    if (filterTag && !img.tags?.some(t => t.toLowerCase().includes(filterTag.toLowerCase()))) return false;
    return true;
  });

  const allTags = Array.from(new Set(images.flatMap(img => img.tags || [])));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">Back</span>
          </a>
          <h1 className="font-serif text-lg">Image Library</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-image">
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Image to Library</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  data-testid="input-file-upload"
                />
                
                {newImage.imageUrl ? (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <img src={newImage.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => setNewImage(prev => ({ ...prev, imageUrl: '' }))}
                      data-testid="button-remove-preview"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 flex flex-col items-center justify-center gap-2 transition-colors"
                    data-testid="button-upload-area"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                  </button>
                )}

                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newImage.name}
                    onChange={(e) => setNewImage(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Image name"
                    data-testid="input-image-name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newImage.category}
                    onValueChange={(value) => setNewImage(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Priority (higher = preferred)</label>
                  <Input
                    type="number"
                    value={newImage.priority}
                    onChange={(e) => setNewImage(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                    data-testid="input-priority"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {newImage.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Add tag..."
                      data-testid="input-tag"
                    />
                    <Button size="icon" onClick={() => addTag(tagInput)} disabled={!tagInput.trim()} data-testid="button-add-tag">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Suggested:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {SUGGESTED_TAGS.filter(t => !newImage.tags.includes(t)).slice(0, 12).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer text-xs"
                          onClick={() => addTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => addImageMutation.mutate(newImage)}
                  disabled={!newImage.imageUrl || !newImage.name || addImageMutation.isPending}
                  data-testid="button-save-image"
                >
                  {addImageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Add to Library
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40" data-testid="select-filter-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tag:</span>
            <Input
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              placeholder="Filter by tag..."
              className="w-40"
              data-testid="input-filter-tag"
            />
          </div>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">{filteredImages.length} images</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredImages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-center">
                {images.length === 0 
                  ? "No images in library yet. Add your first image to get started."
                  : "No images match your filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteImageMutation.mutate(image.id)}
                      disabled={deleteImageMutation.isPending}
                      data-testid={`button-delete-image-${image.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{image.name}</p>
                  <p className="text-xs text-muted-foreground mb-2 capitalize">{image.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {(image.tags || []).slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(image.tags || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags!.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {allTags.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              All Tags in Library
            </h2>
            <div className="flex flex-wrap gap-1">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
