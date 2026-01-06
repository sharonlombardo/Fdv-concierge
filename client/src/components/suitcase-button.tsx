import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
}

export function SuitcaseButton({
  itemId,
  itemData,
  sourceContext,
  aestheticTags = [],
  className,
  size = "md",
  onAddToCart
}: SuitcaseButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
        console.log('SuitcaseButton clicked:', { itemId, itemData, sourceContext, aestheticTags });
        addToSuitcase.mutate();
      }}
      className={cn(
        "rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-sm",
        "hover:bg-white dark:hover:bg-black hover:scale-110 transition-all duration-200",
        "flex items-center justify-center",
        "text-muted-foreground hover:text-foreground",
        sizeClasses[size],
        className
      )}
      disabled={addToSuitcase.isPending}
      title="Add to Suitcase"
      data-testid={`suitcase-button-${itemId}`}
    >
      <Briefcase 
        size={iconSizes[size]}
        strokeWidth={2}
      />
    </button>
  );
}
