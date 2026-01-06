import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { X, User, Camera } from 'lucide-react';
import { Link } from 'wouter';
import type { SelfieImage } from '@shared/schema';

interface SelfiePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSelfie: (selfie: SelfieImage) => void;
  title?: string;
}

export function SelfiePickerModal({ isOpen, onClose, onSelectSelfie, title = "Choose a Photo" }: SelfiePickerModalProps) {
  const { data: selfies = [], isLoading } = useQuery<SelfieImage[]>({
    queryKey: ['/api/selfies'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 flex items-center justify-center p-6" onClick={onClose}>
      <div 
        className="bg-card rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-lg">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-selfie-picker">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : selfies.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {selfies.map((selfie) => (
                <button
                  key={selfie.id}
                  onClick={() => {
                    onSelectSelfie(selfie);
                    onClose();
                  }}
                  className="aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-foreground transition-all"
                  style={{ 
                    backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                  }}
                  data-testid={`button-pick-selfie-${selfie.id}`}
                >
                  <img 
                    src={selfie.processedUrl} 
                    alt={selfie.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No photos yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                Upload photos in the Suitcase to use them here
              </p>
              <Link href="/packing">
                <Button variant="outline" className="gap-2" data-testid="button-go-to-suitcase">
                  <Camera className="w-4 h-4" />
                  Go to Suitcase
                </Button>
              </Link>
            </div>
          )}
        </div>

        {selfies.length > 0 && (
          <div className="p-4 border-t border-border text-center">
            <Link href="/packing">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" data-testid="button-add-more-photos">
                Add more photos in Suitcase
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
