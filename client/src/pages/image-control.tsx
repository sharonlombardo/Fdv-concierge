import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, RotateCcw, Check, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImageSlotData {
  key: string;
  label: string;
  section: string;
  defaultUrl: string;
  currentUrl: string;
  hasCustomImage: boolean;
  aspectRatio?: string;
  description?: string;
}

interface ImageSlotsResponse {
  slots: ImageSlotData[];
  grouped: Record<string, ImageSlotData[]>;
}

function ImageSlotCard({ slot, onUpload, onReset, isUploading }: {
  slot: ImageSlotData;
  onUpload: (slotKey: string, file: File) => void;
  onReset: (slotKey: string) => void;
  isUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(slot.key, file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-card rounded-md border border-border overflow-hidden" data-testid={`slot-card-${slot.key}`}>
      <div className="aspect-video relative bg-stone-100 dark:bg-stone-900">
        <img
          src={slot.currentUrl}
          alt={slot.label}
          className="w-full h-full object-cover"
        />
        {slot.hasCustomImage && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              <Check className="w-3 h-3 mr-1" />
              Custom
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">{slot.label}</h3>
        {slot.description && (
          <p className="text-xs text-muted-foreground mb-3">{slot.description}</p>
        )}
        {slot.aspectRatio && (
          <p className="text-xs text-muted-foreground mb-3">Recommended: {slot.aspectRatio}</p>
        )}
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            data-testid={`input-upload-${slot.key}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1"
            data-testid={`button-upload-${slot.key}`}
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
          {slot.hasCustomImage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReset(slot.key)}
              disabled={isUploading}
              data-testid={`button-reset-${slot.key}`}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImageControlPage() {
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, isLoading } = useQuery<ImageSlotsResponse>({
    queryKey: ["/api/image-slots"],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ slotKey, file }: { slotKey: string; file: File }) => {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;
      
      await apiRequest("POST", `/api/images/${slotKey}`, {
        customUrl: base64,
        label: slotKey
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/image-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({ description: "Image uploaded successfully" });
      setUploadingSlot(null);
    },
    onError: () => {
      toast({ description: "Failed to upload image", variant: "destructive" });
      setUploadingSlot(null);
    }
  });

  const resetMutation = useMutation({
    mutationFn: async (slotKey: string) => {
      await apiRequest("DELETE", `/api/images/${slotKey}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/image-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({ description: "Image reset to default" });
    },
    onError: () => {
      toast({ description: "Failed to reset image", variant: "destructive" });
    }
  });

  const handleUpload = (slotKey: string, file: File) => {
    setUploadingSlot(slotKey);
    uploadMutation.mutate({ slotKey, file });
  };

  const handleReset = (slotKey: string) => {
    resetMutation.mutate(slotKey);
  };

  const sections = data ? Object.entries(
    data.slots.reduce((acc, slot) => {
      if (!acc[slot.section]) acc[slot.section] = [];
      acc[slot.section].push(slot);
      return acc;
    }, {} as Record<string, ImageSlotData[]>)
  ) : [];

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Itinerary
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-amber-600" />
            <h1 className="font-serif text-3xl md:text-4xl font-medium" data-testid="text-page-title">
              Image Control
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Manage all images in your app from one place. Upload your own images to replace the defaults, 
            or reset back to the original placeholders.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map(([sectionName, slots]) => (
              <section key={sectionName}>
                <h2 className="font-serif text-xl font-medium mb-4 pb-2 border-b border-border" data-testid={`section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`}>
                  {sectionName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <ImageSlotCard
                      key={slot.key}
                      slot={slot}
                      onUpload={handleUpload}
                      onReset={handleReset}
                      isUploading={uploadingSlot === slot.key}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
          <h3 className="font-medium mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1. Click "Upload" on any image slot to replace it with your own image</li>
            <li>2. Your custom images are saved and will appear throughout the app</li>
            <li>3. Click the reset button to restore the original placeholder</li>
            <li>4. Images are stored securely and persist between sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
