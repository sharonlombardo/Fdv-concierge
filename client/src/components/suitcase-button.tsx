import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function SuitcaseIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
    >
      <path d="M9 3C9 2.45 9.45 2 10 2H14C14.55 2 15 2.45 15 3V5H9V3Z" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
    </svg>
  );
}

interface SuitcaseButtonProps {
  itemId: string;
  itemData: {
    title?: string;
    brand?: string;
    price?: string;
    imageUrl?: string;
    [key: string]: any;
  };
  sourceContext: string;
  aestheticTags?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
  onAddToCart?: () => void;
  purchased?: boolean;
}

export function SuitcaseButton({
  itemId,
  itemData,
  sourceContext,
  aestheticTags = [],
  className,
  size = "md",
  onAddToCart,
  purchased = false
}: SuitcaseButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isPurchased = purchased;

  const addToSuitcase = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'product',
          itemId,
          sourceContext,
          aestheticTags,
          savedAt: Date.now(),
          purchaseStatus: 'in_cart',
          editTag: itemData.editTag,
          storyTag: itemData.storyTag,
          title: itemData.title,
          assetUrl: itemData.imageUrl,
          metadata: {
            ...itemData,
            purchaseIntent: true,
            addedToCartAt: Date.now()
          }
        })
      });
      
      if (res.status === 400) {
        const updateRes = await fetch(`/api/saves/${encodeURIComponent(itemId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchaseStatus: 'in_cart',
            metadata: {
              ...itemData,
              purchaseIntent: true,
              addedToCartAt: Date.now()
            }
          })
        });
        if (!updateRes.ok) {
          throw new Error('Failed to update save with purchase intent');
        }
        return { success: true, updated: true };
      }
      
      if (!res.ok) {
        throw new Error('Failed to add to suitcase');
      }
      
      return { success: true, updated: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves/check', itemId] });
      
      toast({
        description: "Added to your Suitcase",
        duration: 2000
      });
      
      if (onAddToCart) {
        onAddToCart();
      }
    },
    onError: () => {
      toast({
        description: "Failed to add to Suitcase",
        variant: "destructive",
        duration: 2000
      });
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
        if (!isPurchased) {
          addToSuitcase.mutate();
        }
      }}
      className={cn(
        "hover:scale-110 transition-all duration-200",
        "flex items-center justify-center",
        "text-stone-900 dark:text-stone-100",
        "drop-shadow-md",
        sizeClasses[size],
        className
      )}
      disabled={addToSuitcase.isPending || isPurchased}
      title={isPurchased ? "Purchased" : "Add to Suitcase"}
      data-testid={`suitcase-button-${itemId}`}
    >
      <SuitcaseIcon size={iconSizes[size]} />
    </button>
  );
}
