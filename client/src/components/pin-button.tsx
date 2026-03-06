import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import { triggerSaveEvent } from "./email-capture-manager";

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
            assetUrl: itemData.assetUrl || itemData.imageUrl,
            userEmail: email || undefined
          })
        });
        // 400 = already pinned — treat as success (idempotent)
        if (res.status === 400) {
          return { action: 'pinned' };
        }
        if (!res.ok) throw new Error('Failed to pin');
        incrementSaveCount();
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

      if (data.action === 'pinned') {
        triggerSaveEvent();
        if (onPinSuccess) onPinSuccess();
      }
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
