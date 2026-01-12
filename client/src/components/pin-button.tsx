import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function PinIcon({ size = 18, fill = "none", className }: { size?: number; fill?: string; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 32" 
      fill={fill}
      stroke="currentColor"
      strokeWidth={fill !== "none" ? 0 : 2}
      className={className}
    >
      <circle cx="12" cy="10" r="9" />
      <polygon points="9,18 12,32 15,18" />
    </svg>
  );
}

interface PinButtonProps {
  itemType: string;
  itemId: string;
  itemData: {
    title?: string;
    imageUrl?: string;
    description?: string;
    editionTag?: string;
    storyTag?: string;
    editTag?: string;
    assetKey?: string;
    assetUrl?: string;
    [key: string]: any;
  };
  sourceContext: string;
  aestheticTags?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PinButton({
  itemType,
  itemId,
  itemData,
  sourceContext,
  aestheticTags = [],
  className,
  size = "md"
}: PinButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: isPinned } = useQuery({
    queryKey: ['/api/saves/check', itemId],
    queryFn: async () => {
      const res = await fetch(`/api/saves/check/${encodeURIComponent(itemId)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.isPinned;
    }
  });

  const pinMutation = useMutation({
    mutationFn: async () => {
      if (isPinned) {
        const res = await fetch(`/api/saves/${encodeURIComponent(itemId)}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to unpin');
        return { action: 'unpinned' };
      } else {
        const res = await fetch('/api/saves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemType,
            itemId,
            sourceContext,
            aestheticTags,
            metadata: itemData,
            savedAt: Date.now(),
            editionTag: itemData.editionTag,
            storyTag: itemData.storyTag,
            editTag: itemData.editTag,
            title: itemData.title,
            assetUrl: itemData.assetUrl || itemData.imageUrl
          })
        });
        if (!res.ok) throw new Error('Failed to pin');
        return { action: 'pinned' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', itemId] });
      
      toast({
        description: data.action === 'pinned' ? 'Saved to your Suitcase' : 'Removed from Suitcase',
        duration: 2000
      });
    }
  });

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        pinMutation.mutate();
      }}
      className={cn(
        "hover:scale-110 transition-all duration-200",
        "flex items-center justify-center",
        isPinned ? "text-amber-600" : "text-stone-800 dark:text-stone-200",
        "drop-shadow-sm",
        sizeClasses[size],
        className
      )}
      disabled={pinMutation.isPending}
      data-testid={`pin-button-${itemId}`}
    >
      <PinIcon 
        size={iconSizes[size]} 
        fill="currentColor"
      />
    </button>
  );
}
