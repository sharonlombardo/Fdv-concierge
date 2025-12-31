import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, X, Trash2, Check, Loader2, Settings, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { ImageRule, ImageLibraryItem } from '@shared/schema';

const TIME_OPTIONS = ['morning', 'afternoon', 'evening', 'night'];
const LOCATION_OPTIONS = ['marrakech', 'atlas', 'essaouira', 'agafay', 'desert', 'medina', 'riad', 'airport'];
const IMAGE_TYPES = [
  { value: 'item', label: 'Itinerary Item' },
  { value: 'wardrobe', label: 'Wardrobe/Style' },
  { value: 'cover', label: 'Cover Image' },
];

interface RuleFormData {
  name: string;
  imageType: string;
  matchLocation: string[];
  matchTime: string[];
  matchKeywords: string[];
  assignTags: string[];
  priority: number;
  enabled: number;
}

const defaultRule: RuleFormData = {
  name: '',
  imageType: 'item',
  matchLocation: [],
  matchTime: [],
  matchKeywords: [],
  assignTags: [],
  priority: 0,
  enabled: 1,
};

export default function ImageRules() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<RuleFormData>(defaultRule);
  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const { data: rules = [], isLoading } = useQuery<ImageRule[]>({
    queryKey: ['/api/rules'],
  });

  const { data: libraryImages = [] } = useQuery<ImageLibraryItem[]>({
    queryKey: ['/api/library'],
  });

  const addRuleMutation = useMutation({
    mutationFn: async (data: RuleFormData) => {
      return apiRequest('POST', '/api/rules', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      setIsAddDialogOpen(false);
      setNewRule(defaultRule);
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<RuleFormData> }) => {
      return apiRequest('PATCH', `/api/rules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/rules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
    },
  });

  const addArrayItem = (field: 'matchLocation' | 'matchTime' | 'matchKeywords' | 'assignTags', value: string) => {
    const normalizedValue = value.toLowerCase().trim();
    if (normalizedValue && !newRule[field].includes(normalizedValue)) {
      setNewRule(prev => ({ ...prev, [field]: [...prev[field], normalizedValue] }));
    }
  };

  const removeArrayItem = (field: 'matchLocation' | 'matchTime' | 'matchKeywords' | 'assignTags', value: string) => {
    setNewRule(prev => ({ ...prev, [field]: prev[field].filter(v => v !== value) }));
  };

  const toggleOption = (field: 'matchLocation' | 'matchTime', value: string) => {
    if (newRule[field].includes(value)) {
      removeArrayItem(field, value);
    } else {
      addArrayItem(field, value);
    }
  };

  const allLibraryTags = Array.from(new Set(libraryImages.flatMap(img => img.tags || [])));

  const getMatchingImagesCount = (tags: string[]) => {
    if (tags.length === 0) return 0;
    return libraryImages.filter(img => 
      tags.some(tag => img.tags?.includes(tag))
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">Back</span>
          </a>
          <h1 className="font-serif text-lg">Image Rules</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-rule">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Rule Name</label>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Morning Marrakech Dining"
                    data-testid="input-rule-name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Apply To</label>
                  <Select
                    value={newRule.imageType}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, imageType: value }))}
                  >
                    <SelectTrigger data-testid="select-image-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Match Time of Day</label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map(time => (
                      <Badge
                        key={time}
                        variant={newRule.matchTime.includes(time) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleOption('matchTime', time)}
                      >
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Match Location</label>
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_OPTIONS.map(loc => (
                      <Badge
                        key={loc}
                        variant={newRule.matchLocation.includes(loc) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleOption('matchLocation', loc)}
                      >
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Match Keywords in Title/Description</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {newRule.matchKeywords.map(kw => (
                      <Badge key={kw} variant="secondary" className="gap-1">
                        {kw}
                        <button onClick={() => removeArrayItem('matchKeywords', kw)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('matchKeywords', keywordInput);
                          setKeywordInput('');
                        }
                      }}
                      placeholder="e.g., dining, restaurant, lunch..."
                      data-testid="input-keyword"
                    />
                    <Button
                      size="icon"
                      onClick={() => {
                        addArrayItem('matchKeywords', keywordInput);
                        setKeywordInput('');
                      }}
                      disabled={!keywordInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium block mb-2">Assign Images With Tags</label>
                  <p className="text-xs text-muted-foreground mb-2">When this rule matches, use images with these tags from your library</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {newRule.assignTags.map(tag => (
                      <Badge key={tag} variant="default" className="gap-1">
                        {tag}
                        <button onClick={() => removeArrayItem('assignTags', tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {allLibraryTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {allLibraryTags.filter(t => !newRule.assignTags.includes(t)).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer text-xs"
                          onClick={() => addArrayItem('assignTags', tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Add images to your library first to see available tags</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('assignTags', tagInput);
                          setTagInput('');
                        }
                      }}
                      placeholder="Or type a tag..."
                      data-testid="input-assign-tag"
                    />
                    <Button
                      size="icon"
                      onClick={() => {
                        addArrayItem('assignTags', tagInput);
                        setTagInput('');
                      }}
                      disabled={!tagInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newRule.assignTags.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {getMatchingImagesCount(newRule.assignTags)} images in library match these tags
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Priority (higher = evaluated first)</label>
                  <Input
                    type="number"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                    data-testid="input-priority"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => addRuleMutation.mutate(newRule)}
                  disabled={!newRule.name || newRule.assignTags.length === 0 || addRuleMutation.isPending}
                  data-testid="button-save-rule"
                >
                  {addRuleMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Create Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium mb-1">How Rules Work</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Rules automatically assign images from your <a href="/library" className="underline">Image Library</a> to itinerary items based on matching criteria:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mb-3">
                  <li><strong>Set matching criteria</strong> - Choose time of day, location, and/or keywords</li>
                  <li><strong>Assign tags</strong> - Select which library image tags to use when criteria match</li>
                  <li><strong>Priority order</strong> - Higher priority rules are checked first</li>
                </ol>
                <p className="text-xs text-muted-foreground italic">
                  Example: A rule matching "morning" + "marrakech" with tag "medina-sunrise" will show that tagged image for morning Marrakech items.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Settings className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-center">
                No rules created yet. Add a rule to automatically assign images.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className={rule.enabled === 0 ? 'opacity-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">{rule.name}</CardTitle>
                      <CardDescription className="capitalize">{rule.imageType} images</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateRuleMutation.mutate({ 
                          id: rule.id, 
                          data: { enabled: rule.enabled === 1 ? 0 : 1 } 
                        })}
                        data-testid={`button-toggle-rule-${rule.id}`}
                      >
                        {rule.enabled === 1 ? (
                          <ToggleRight className="w-5 h-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRuleMutation.mutate(rule.id)}
                        disabled={deleteRuleMutation.isPending}
                        data-testid={`button-delete-rule-${rule.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {(rule.matchTime?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">Time:</span>
                        {rule.matchTime?.map(t => (
                          <Badge key={t} variant="outline" className="capitalize">{t}</Badge>
                        ))}
                      </div>
                    )}
                    {(rule.matchLocation?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">Location:</span>
                        {rule.matchLocation?.map(l => (
                          <Badge key={l} variant="outline" className="capitalize">{l}</Badge>
                        ))}
                      </div>
                    )}
                    {(rule.matchKeywords?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">Keywords:</span>
                        {rule.matchKeywords?.map(k => (
                          <Badge key={k} variant="outline">{k}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                      <span className="text-muted-foreground">Uses images tagged:</span>
                      {rule.assignTags?.map(t => (
                        <Badge key={t} variant="default">{t}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">
                        Priority: {rule.priority}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/library" data-testid="link-to-library">
            <Button variant="outline">
              Manage Image Library
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
