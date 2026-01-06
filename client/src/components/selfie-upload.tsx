import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { removeBackground } from '@imgly/background-removal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Loader2, User, Trash2, Check } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { SelfieImage } from '@shared/schema';

interface SelfieUploadProps {
  onSelectSelfie?: (selfie: SelfieImage) => void;
  selectedSelfieId?: number | null;
}

export function SelfieUpload({ onSelectSelfie, selectedSelfieId }: SelfieUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: selfies = [], isLoading } = useQuery<SelfieImage[]>({
    queryKey: ['/api/selfies'],
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const addSelfieMutation = useMutation({
    mutationFn: async (data: { name: string; originalUrl: string; processedUrl: string }) => {
      const res = await apiRequest('POST', '/api/selfies', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selfies'] });
      setPreviewUrl(null);
      setProcessedUrl(null);
      setUploadName('');
    },
  });

  const deleteSelfieMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/selfies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/selfies'] });
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const originalDataUrl = e.target?.result as string;
      setPreviewUrl(originalDataUrl);
      setUploadName(file.name.replace(/\.[^/.]+$/, ''));
      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        const imageBlob = await fetch(originalDataUrl).then(r => r.blob());
        
        const resultBlob = await removeBackground(imageBlob, {
          progress: (key, current, total) => {
            const progress = Math.round((current / total) * 100);
            setProcessingProgress(progress);
          },
        });
        
        const processedDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(resultBlob);
        });
        
        setProcessedUrl(processedDataUrl);
      } catch (error) {
        console.error('Background removal failed:', error);
        setProcessedUrl(originalDataUrl);
      } finally {
        setIsProcessing(false);
        setProcessingProgress(100);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!previewUrl || !processedUrl || !uploadName.trim()) return;
    
    addSelfieMutation.mutate({
      name: uploadName.trim(),
      originalUrl: previewUrl,
      processedUrl: processedUrl,
    });
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setProcessedUrl(null);
    setUploadName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground">
          Your Photos
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          data-testid="button-upload-selfie"
        >
          <Upload className="w-3.5 h-3.5 mr-2" />
          Add Photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-selfie-file"
        />
      </div>

      {(previewUrl || isProcessing) && (
        <Card className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Original</p>
              <div className="aspect-square bg-muted rounded-md overflow-hidden">
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">
                {isProcessing ? 'Processing...' : 'Background Removed'}
              </p>
              <div className="aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center" style={{ 
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}>
                {isProcessing ? (
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{processingProgress}%</p>
                  </div>
                ) : processedUrl ? (
                  <img 
                    src={processedUrl} 
                    alt="Processed" 
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {!isProcessing && processedUrl && (
            <div className="space-y-3">
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Photo name..."
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-selfie-name"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex-1"
                  data-testid="button-cancel-selfie"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!uploadName.trim() || addSelfieMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-selfie"
                >
                  {addSelfieMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save Photo'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : selfies.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {selfies.map((selfie) => (
            <div 
              key={selfie.id} 
              className="relative group"
            >
              <button
                onClick={() => onSelectSelfie?.(selfie)}
                className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-all ${
                  selectedSelfieId === selfie.id 
                    ? 'border-foreground' 
                    : 'border-transparent hover:border-muted-foreground/50'
                }`}
                style={{ 
                  backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)',
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                }}
                data-testid={`button-select-selfie-${selfie.id}`}
              >
                <img 
                  src={selfie.processedUrl} 
                  alt={selfie.name}
                  className="w-full h-full object-contain"
                />
                {selectedSelfieId === selfie.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <Check className="w-6 h-6 text-foreground" />
                  </div>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSelfieMutation.mutate(selfie.id);
                }}
                className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-delete-selfie-${selfie.id}`}
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-[10px] text-center mt-1 text-muted-foreground truncate">
                {selfie.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No photos yet</p>
          <p className="text-xs mt-1">Upload a photo to get started</p>
        </div>
      )}
    </div>
  );
}
