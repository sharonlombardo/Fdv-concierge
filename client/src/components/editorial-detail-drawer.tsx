import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PinButton } from "@/components/pin-button";
import { SuitcaseButton } from "@/components/suitcase-button";
import { ExternalLink } from "lucide-react";

export type EditorialItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  bucket: string;
  pinType: string;
  assetKey: string;
  storyTag: string;
  imageUrl?: string;
  shopLink?: string;
  isPurchaseable?: boolean;
};

type EditorialDetailDrawerProps = {
  item: EditorialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditorialDetailDrawer({ item, open, onOpenChange }: EditorialDetailDrawerProps) {
  if (!item) return null;

  const isPurchaseable = item.isPurchaseable || 
    item.pinType === "object" || 
    item.pinType === "look" || 
    item.pinType === "product";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" data-testid="drawer-editorial-detail">
        <SheetHeader className="sr-only">
          <SheetTitle>{item.title}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 -mx-2 flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm uppercase tracking-widest">
                {item.title}
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              {item.bucket}
            </p>
            <h2 className="font-serif text-2xl font-medium">{item.title}</h2>
            {item.subtitle && (
              <p className="text-muted-foreground mt-1 italic">{item.subtitle}</p>
            )}
          </div>

          {item.description && (
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{item.pinType}</Badge>
            <Badge variant="secondary">{item.storyTag}</Badge>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Save:</span>
              <PinButton
                itemType={item.pinType}
                itemId={item.id}
                itemData={{
                  title: item.title,
                  subtitle: item.subtitle,
                  bucket: item.bucket,
                  sourceStory: item.storyTag,
                  issueNumber: 1,
                  saveType: item.pinType,
                  storyTag: item.storyTag,
                  editionTag: "current-edition-1",
                  editTag: `${item.storyTag}-edit`,
                  assetKey: item.assetKey,
                  assetUrl: item.imageUrl || "",
                  imageUrl: item.imageUrl
                }}
                sourceContext="the_current_issue_1"
                aestheticTags={[item.bucket.toLowerCase(), item.pinType.toLowerCase(), item.storyTag]}
                size="md"
              />
            </div>

            {isPurchaseable && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Cart:</span>
                  <SuitcaseButton
                    itemId={item.id}
                    itemData={{
                      title: item.title,
                      imageUrl: item.imageUrl,
                      editTag: `${item.storyTag}-edit`,
                      storyTag: item.storyTag
                    }}
                    sourceContext="the_current_issue_1"
                    aestheticTags={[item.bucket.toLowerCase(), item.pinType.toLowerCase()]}
                    size="md"
                  />
                </div>

                {item.shopLink && (
                  <a
                    href={item.shopLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Product
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
