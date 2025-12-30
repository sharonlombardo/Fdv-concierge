import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export interface JournalEntry {
  note?: string;
  image?: string;
  myLook?: string;
  logImage?: string;
  updatedAt?: number;
}

export interface JournalEntries {
  [key: string]: JournalEntry;
}

const STORAGE_KEY = 'fdv_concierge_journal_v1';

export function useJournal() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [localEntries, setLocalEntries] = useState<JournalEntries>({});

  const { data: serverEntries, isLoading } = useQuery<JournalEntries>({
    queryKey: ['/api/journal'],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocalEntries(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage restricted");
    }
  }, []);

  const entries = { ...localEntries, ...(serverEntries ?? {}) };
  
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JournalEntry> }) => {
      const response = await apiRequest('POST', `/api/journal/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] });
    },
  });

  const saveEntry = useCallback((id: string, data: Partial<JournalEntry>) => {
    setStatus('saving');
    
    setLocalEntries(prev => {
      const currentEntry = entriesRef.current[id] || prev[id] || {};
      const updatedEntry = { ...currentEntry, ...data, updatedAt: Date.now() };
      const updatedEntries = { ...prev, [id]: updatedEntry };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      } catch (e) { 
        console.warn("Quota exceeded"); 
      }
      
      return updatedEntries;
    });

    const hasImageData = 'myLook' in data || 'logImage' in data || 'image' in data;
    
    if (!hasImageData) {
      saveMutation.mutate(
        { id, data },
        {
          onSettled: () => {
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 2000);
          },
        }
      );
    } else {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }, [saveMutation]);

  return { 
    entries, 
    saveEntry, 
    status: saveMutation.isPending ? 'saving' : status,
    isLoading 
  };
}
