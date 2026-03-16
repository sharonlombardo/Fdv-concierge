import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import { triggerSaveEvent } from "./email-capture-manager";
import { getProductByKey } from "@/lib/brand-genome";

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
  onPinSuccess?: () => void;
}

export function PinButton({
  itemType,
  itemId,
  itemData,
  sourceContext,
  aestheticTags = [],
  className,
  size = "md",
  onPinSuccess
}: PinButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { email, incrementSaveCount } = useUser();
  
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
            itemType: itemType || 'style',
            itemId,
            sourceContext,
            aestheticTags: (aestheticTags || []).filter(Boolean),
            metadata: itemData,
            savedAt: Date.now(),
            editionTag: itemData.editionTag || undefined,
            storyTag: itemData.storyTag || undefined,
            editTag: itemData.editTag || undefined,
            title: itemData.title || undefined,
            assetUrl: itemData.assetUrl || itemData.imageUrl || undefined,
            brand: itemData.brand || undefined,
            price: itemData.price ? String(itemData.price) : undefined,
            shopUrl: itemData.shopUrl || undefined,
            bookUrl: itemData.bookUrl || undefined,
            category: (() => {
              const key = itemData.assetKey || itemData.genomeKey || itemId;
              const product = getProductByKey(key);
              return product?.category || undefined;
            })()
          })
        });
        // 409 or 400 "Already pinned" — treat as success
        if (res.status === 409 || res.status === 400) {
          const body = await res.json().catch(() => ({}));
          if (body.error === "Already pinned") {
            return { action: 'pinned' };
          }
          // Actual validation error
          console.error('[PinButton] Save validation failed:', body.details || body.error);
          throw new Error('Save validation failed');
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('[PinButton] Save failed:', res.status, body);
          throw new Error('Failed to pin');
        }
        incrementSaveCount();
        return { action: 'pinned' };
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['/api/saves/check', itemId] });
      const previous = queryClient.getQueryData(['/api/saves/check', itemId]);
      // queryFn returns a boolean, so set the cache to a boolean (not an object)
      queryClient.setQueryData(['/api/saves/check', itemId], !isPinned);
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['/api/saves/check', itemId], context.previous);
      }
      console.error('[PinButton] Save failed:', err);
      toast({ description: 'Could not save — please try again', duration: 3000 });
    },
    onSuccess: (data) => {
      toast({
        description: data.action === 'pinned' ? 'Saved to your Suitcase' : 'Removed from Suitcase',
        duration: 2000
      });

      if (data.action === 'pinned') {
        triggerSaveEvent();
        if (onPinSuccess) onPinSuccess();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', itemId] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
    }
  });

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconSizes = {
    sm: 17,
    md: 22,
    lg: 26
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
        sizeClasses[size],
        className
      )}
      style={{
        color: isPinned ? "#c9a84c" : "#ffffff",
        filter: isPinned
          ? "drop-shadow(0 0 6px rgba(201,168,76,0.5))"
          : "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
      }}
      disabled={pinMutation.isPending}
      data-testid={`pin-button-${itemId}`}
    >
      <PinIcon
        size={iconSizes[size]}
        fill={isPinned ? "currentColor" : "none"}
        className={isPinned ? "" : ""}
      />
    </button>
  );
}
