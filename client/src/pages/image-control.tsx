import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, RotateCcw, Check, Image as ImageIcon, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface CategoryData {
  name: string;
  sections: { name: string; slots: ImageSlotData[] }[];
  totalSlots: number;
  customCount: number;
}

// Mapping from slot keys to their suitcase bucket destinations
const SLOT_BUCKET_MAP: Record<string, string> = {
  // Opening
  "opening-cover": "Inspired",
  // Morocco section - heroes and moments
  "morocco-hero": "Travel & Experience",
  "morocco-style-1": "Style",
  "morocco-texture-1": "Inspired",
  "morocco-object-1": "Object of Desire",
  "morocco-experience-1": "Travel & Experience",
  "morocco-ritual-1": "Ritual",
  // Morocco tiles
  "morocco-tile-1": "Inspired",
  "morocco-tile-2": "Travel & Experience",
  "morocco-tile-3": "Style",
  "morocco-tile-4": "Object of Desire",
  "morocco-tile-5": "Ritual",
  "morocco-tile-6": "Inspired",
  // Hydra section - heroes and moments
  "hydra-hero": "Travel & Experience",
  "hydra-style-1": "Style",
  "hydra-texture-1": "Inspired",
  "hydra-object-1": "Object of Desire",
  "hydra-ritual-1": "Ritual",
  // Hydra tiles
  "hydra-tile-1": "Inspired",
  "hydra-tile-2": "Ritual",
  "hydra-tile-3": "Style",
  "hydra-tile-4": "Object of Desire",
  "hydra-tile-5": "Object of Desire",
  "hydra-tile-6": "Travel & Experience",
  "hydra-light-1": "Inspired",
  "hydra-light-2": "Inspired",
  // Slow Travel section - heroes and moments
  "slow-travel-hero": "State of Mind",
  "slow-culture-1": "Culture",
  "slow-style-1": "Style",
  "slow-object-1": "Object of Desire",
  "slow-ritual-1": "Ritual",
  // Slow Travel tiles
  "slow-lunch": "Culture",
  "slow-museum": "Culture",
  "slow-tile-1": "Style",
  "slow-tile-2": "Object of Desire",
  "slow-tile-3": "Object of Desire",
  "slow-tile-4": "Ritual",
  "slow-tile-5": "Ritual",
  "slow-tile-6": "Inspired",
  // Retreat section - heroes and moments
  "retreat-hero": "Travel & Experience",
  "retreat-ritual-1": "Ritual",
  "retreat-place-1": "Travel & Experience",
  "retreat-object-1": "Object of Desire",
  "retreat-style-1": "Style",
  // Retreat tiles
  "retreat-tile-1": "Object of Desire",
  "retreat-tile-2": "Object of Desire",
  "retreat-tile-3": "Object of Desire",
  "retreat-tile-4": "Ritual",
  "retreat-tile-5": "Travel & Experience",
  "retreat-tile-6": "Style",
  // New York section - heroes and moments
  "newyork-hero": "Culture",
  "newyork-style-1": "Style",
  "newyork-culture-1": "Culture",
  "newyork-experience-1": "Travel & Experience",
  "newyork-object-1": "Object of Desire",
  "newyork-ritual-1": "Ritual",
  // New York tiles
  "ny-tile-1": "Travel & Experience",
  "ny-tile-2": "Travel & Experience",
  "ny-tile-3": "Culture",
  "ny-tile-4": "Style",
  "ny-tile-5": "Object of Desire",
  "ny-tile-6": "Inspired",
  "ny-culture-1": "Culture",
  "ny-culture-2": "Culture",
  "ny-reset-1": "Ritual",
  "ny-reset-2": "Object of Desire",
  "ny-reset-3": "Object of Desire",
  "ny-reset-4": "Inspired",
};

function getSlotBucketLabel(slotKey: string): string | null {
  return SLOT_BUCKET_MAP[slotKey] || null;
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
        {getSlotBucketLabel(slot.key) && (
          <p className="text-[10px] text-muted-foreground/60 italic mb-2">{getSlotBucketLabel(slot.key)}</p>
        )}
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

function getCategoryFromSection(section: string): string {
  if (section.startsWith("The Current:")) return "The Current";
  if (section.startsWith("Morocco Editorial:")) {
    if (section.includes("Wardrobe Extras")) return "Morocco Wardrobe Extras";
    return "Morocco Editorial";
  }
  if (section.includes("Landing") || section.includes("Trip Transition") || section.includes("Today's Edit")) {
    return "Landing Page";
  }
  return section;
}

function organizeByCategory(slots: ImageSlotData[]): CategoryData[] {
  const categoryMap = new Map<string, Map<string, ImageSlotData[]>>();
  
  for (const slot of slots) {
    const category = getCategoryFromSection(slot.section);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Map());
    }
    const sectionMap = categoryMap.get(category)!;
    if (!sectionMap.has(slot.section)) {
      sectionMap.set(slot.section, []);
    }
    sectionMap.get(slot.section)!.push(slot);
  }

  const categoryOrder = [
    "The Current",
    "Landing Page", 
    "Morocco Editorial",
    "Morocco Wardrobe Extras"
  ];

  const result: CategoryData[] = [];
  
  for (const categoryName of categoryOrder) {
    const sectionMap = categoryMap.get(categoryName);
    if (sectionMap) {
      const sectionEntries = Array.from(sectionMap.entries()) as [string, ImageSlotData[]][];
      const sections = sectionEntries.map(([name, slots]) => ({
        name,
        slots
      }));
      const allSlots = sections.flatMap(s => s.slots);
      result.push({
        name: categoryName,
        sections,
        totalSlots: allSlots.length,
        customCount: allSlots.filter(s => s.hasCustomImage).length
      });
    }
  }

  const allCategories = Array.from(categoryMap.entries());
  for (const [categoryName, sectionMap] of allCategories) {
    if (!categoryOrder.includes(categoryName)) {
      const sectionEntries = Array.from(sectionMap.entries()) as [string, ImageSlotData[]][];
      const sections = sectionEntries.map(([name, slots]) => ({
        name,
        slots
      }));
      const allSlots = sections.flatMap(s => s.slots);
      result.push({
        name: categoryName,
        sections,
        totalSlots: allSlots.length,
        customCount: allSlots.filter(s => s.hasCustomImage).length
      });
    }
  }

  return result;
}

export default function ImageControlPage() {
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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

  const categories = data ? organizeByCategory(data.slots) : [];

  const scrollToCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    const element = document.getElementById(`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <div className="flex">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border bg-card/50 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <h1 className="font-serif text-lg font-medium">Image Control</h1>
            </div>

            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => scrollToCategory(category.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors hover-elevate ${
                    activeCategory === category.name 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`nav-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs opacity-60">{category.customCount}/{category.totalSlots}</span>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Quick Tips</p>
              <ul className="space-y-1">
                <li>Click a category to jump to it</li>
                <li>Expand sections to see slots</li>
                <li>Green badge = custom image</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 bg-[#fafaf9] dark:bg-background border-b border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home-mobile">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <span className="font-serif font-medium">Image Control</span>
              </div>
            </div>
            
            {/* Mobile Category Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => scrollToCategory(category.name)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === category.name 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-stone-200 dark:bg-stone-800 text-muted-foreground'
                  }`}
                  data-testid={`nav-mobile-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 lg:p-8 max-w-5xl">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 className="font-serif text-3xl font-medium mb-2" data-testid="text-page-title">
                Image Control Center
              </h1>
              <p className="text-muted-foreground">
                Manage all images in your app. Upload custom images or reset to defaults.
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => (
                  <section 
                    key={category.name}
                    id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="scroll-mt-24 lg:scroll-mt-8"
                  >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                      <h2 className="font-serif text-xl font-medium">{category.name}</h2>
                      <Badge variant="outline" className="text-xs">
                        {category.customCount} of {category.totalSlots} customized
                      </Badge>
                    </div>

                    <Accordion type="multiple" className="space-y-2">
                      {category.sections.map((section, idx) => {
                        const sectionId = section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const customInSection = section.slots.filter(s => s.hasCustomImage).length;
                        
                        return (
                          <AccordionItem 
                            key={section.name} 
                            value={`${category.name}-${idx}`}
                            className="border border-border rounded-md bg-card/50 overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-stone-50 dark:hover:bg-stone-900/50">
                              <div className="flex items-center justify-between w-full pr-4">
                                <span className="font-medium text-sm">{section.name}</span>
                                <div className="flex items-center gap-2">
                                  {customInSection > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                                      {customInSection} custom
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">{section.slots.length} slots</span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                                {section.slots.map((slot) => (
                                  <ImageSlotCard
                                    key={slot.key}
                                    slot={slot}
                                    onUpload={handleUpload}
                                    onReset={handleReset}
                                    isUploading={uploadingSlot === slot.key}
                                  />
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </section>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
