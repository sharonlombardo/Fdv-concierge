import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  ITINERARY_DATA, 
  type ItineraryPage, 
  type DayPage,
  type CoverPage 
} from '@/lib/itinerary-data';
import type { CustomImage } from '@shared/schema';

interface ImageItem {
  key: string;
  label: string;
  originalUrl: string;
  category: string;
}

function extractAllImages(): ImageItem[] {
  const images: ImageItem[] = [];
  
  ITINERARY_DATA.forEach((page: ItineraryPage) => {
    if ('type' in page && page.type === 'cover') {
      const coverPage = page as CoverPage;
      images.push({
        key: 'cover-main',
        label: 'Cover Image',
        originalUrl: coverPage.image,
        category: 'Cover'
      });
    }
    
    if ('day' in page) {
      const dayPage = page as DayPage;
      
      // Add day hero image
      images.push({
        key: `day-${dayPage.day}-hero`,
        label: `Day ${dayPage.day}: Hero Image`,
        originalUrl: dayPage.flow[0]?.image || '',
        category: `Day ${dayPage.day}`
      });
      
      dayPage.flow.forEach((item, index) => {
        images.push({
          key: item.id,
          label: `Day ${dayPage.day}: ${item.title}`,
          originalUrl: item.image,
          category: `Day ${dayPage.day}`
        });
        
        if (item.commercialWardrobe) {
          images.push({
            key: `${item.id}-wardrobe`,
            label: `Day ${dayPage.day}: ${item.title} (Style)`,
            originalUrl: item.commercialWardrobe,
            category: `Day ${dayPage.day} - Style`
          });
        }
      });
    }
  });
  
  return images;
}

function ImageCard({ 
  item, 
  customImage, 
  onUpload, 
  onDelete,
  isUploading
}: { 
  item: ImageItem; 
  customImage?: CustomImage;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayUrl = customImage?.customUrl || item.originalUrl;
  const isCustom = !!customImage?.customUrl;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-[4/3] relative bg-muted">
        <img 
          src={displayUrl} 
          alt={item.label}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=400';
          }}
        />
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
          </div>
        )}
        
        {isCustom && !isUploading && (
          <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button 
            size="icon" 
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            data-testid={`button-upload-${item.key}`}
          >
            <Upload className="w-4 h-4" />
          </Button>
          {isCustom && (
            <Button 
              size="icon" 
              variant="destructive"
              onClick={onDelete}
              disabled={isUploading}
              data-testid={`button-delete-${item.key}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      
      <div className="p-3 space-y-1">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
          {item.category}
        </p>
        <p className="text-sm font-medium truncate" title={item.label}>
          {item.label}
        </p>
        {isCustom && (
          <p className="text-[10px] text-green-600 font-medium">Custom image applied</p>
        )}
      </div>
    </Card>
  );
}

export default function ImageManagement() {
  const { toast } = useToast();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  const allImages = extractAllImages();
  const categories = ['all', ...Array.from(new Set(allImages.map(img => img.category)))];
  
  const filteredImages = filter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === filter);

  const { data: customImages = [], isLoading, refetch } = useQuery<CustomImage[]>({
    queryKey: ['/api/images'],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ imageKey, file, originalUrl, label }: { 
      imageKey: string; 
      file: File; 
      originalUrl: string;
      label: string;
    }) => {
      return new Promise<CustomImage>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const response = await apiRequest('POST', `/api/images/${imageKey}`, {
              customUrl: base64,
              originalUrl,
              label,
            });
            const data = await response.json();
            resolve(data as CustomImage);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      await refetch();
      setTimeout(() => {
        setUploadingKey(null);
      }, 100);
      toast({
        title: "Image saved",
        description: `Custom image for "${data.label}" has been saved.`,
      });
    },
    onError: (error) => {
      setUploadingKey(null);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to save custom image.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageKey: string) => {
      await apiRequest('DELETE', `/api/images/${imageKey}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      await refetch();
      toast({
        title: "Image removed",
        description: "Custom image has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to remove custom image.",
        variant: "destructive",
      });
    }
  });

  const handleUpload = useCallback((item: ImageItem, file: File) => {
    setUploadingKey(item.key);
    uploadMutation.mutate({ 
      imageKey: item.key, 
      file, 
      originalUrl: item.originalUrl,
      label: item.label 
    });
  }, [uploadMutation]);

  const handleDelete = useCallback((imageKey: string) => {
    deleteMutation.mutate(imageKey);
  }, [deleteMutation]);

  const getCustomImage = (key: string) => {
    return customImages.find(img => img.imageKey === key);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-serif font-semibold">Image Management</h1>
              <p className="text-xs text-muted-foreground">
                {customImages.length} custom images / {allImages.length} total
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm bg-transparent border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
              data-testid="select-filter"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Images' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                Click on any image to upload your own replacement. Custom images are indicated with a green checkmark. 
                Hover over an image to see upload and delete options.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((item) => (
                <ImageCard
                  key={item.key}
                  item={item}
                  customImage={getCustomImage(item.key)}
                  onUpload={(file) => handleUpload(item, file)}
                  onDelete={() => handleDelete(item.key)}
                  isUploading={uploadingKey === item.key}
                />
              ))}
            </div>
            
            {filteredImages.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No images found for this filter.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
