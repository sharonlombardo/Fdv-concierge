import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface SaveItem {
  id: number;
  itemType: string;
  itemId: string;
  sourceContext: string | null;
  aestheticTags: string[] | null;
  savedAt: number;
  metadata: Record<string, unknown> | null;
}

interface DebugSavesResponse {
  count: number;
  saves: SaveItem[];
}

export default function TestSaves() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<DebugSavesResponse>({
    queryKey: ['/api/saves/debug'],
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', '/api/saves/all');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saves/debug'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saves'] });
    },
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Debug: Saved Items</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => clearAllMutation.mutate()}
              disabled={clearAllMutation.isPending}
              data-testid="button-clear-all"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Total Saves: {isLoading ? '...' : data?.count ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : data?.saves.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No saved items yet. Go pin some items in the itinerary!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.saves.map((save) => (
              <Card key={save.id} data-testid={`card-save-${save.id}`}>
                <CardContent className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Item ID</div>
                      <div className="font-mono text-xs break-all">{save.itemId}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Type</div>
                      <div className="font-medium">{save.itemType}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Context</div>
                      <div>{save.sourceContext || '-'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Saved At</div>
                      <div className="text-xs">{formatDate(save.savedAt)}</div>
                    </div>
                  </div>
                  
                  {save.metadata && (() => {
                    const meta = save.metadata as { title?: string; purchaseIntent?: boolean; shopLink?: string };
                    return (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Metadata</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {meta.title && (
                            <div>
                              <span className="text-muted-foreground">title:</span>{' '}
                              <span className="font-medium">{meta.title}</span>
                            </div>
                          )}
                          {meta.purchaseIntent !== undefined && (
                            <div>
                              <span className="text-muted-foreground">purchaseIntent:</span>{' '}
                              <span className={meta.purchaseIntent ? 'text-green-600 font-bold' : ''}>
                                {String(meta.purchaseIntent)}
                              </span>
                            </div>
                          )}
                          {meta.shopLink && (
                            <div>
                              <span className="text-muted-foreground">shopLink:</span>{' '}
                              <a 
                                href={meta.shopLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                View
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {save.aestheticTags && save.aestheticTags.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {save.aestheticTags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
