'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import tvClient from '@/lib/tradingview-api';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface SymbolSearchResult {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
}

interface SymbolSelectorProps {
  initialSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

export default function SymbolSelector({ initialSymbol, onSymbolChange }: SymbolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSymbol);
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState(0);

  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    setSearchTerm(initialSymbol);
  }, [initialSymbol]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      tvClient
        .searchSymbols(debouncedSearchTerm)
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Search failed:', error);
          setResults([]);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelect = (symbol: string) => {
    setSearchTerm(symbol);
    onSymbolChange(symbol);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild ref={triggerRef}>
        <button
          className={cn(
            "w-64 rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground",
            isOpen && "bg-accent text-accent-foreground"
          )}
        >
          {searchTerm}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: `${popoverWidth}px` }}
        align="start"
      >
        <div className="p-2">
            <Input
              placeholder="Search symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            results.map((item) => (
              <div
                key={`${item.symbol}-${item.exchange}`}
                onClick={() => handleSelect(item.symbol)}
                className="cursor-pointer p-2 hover:bg-accent"
              >
                <div className="font-bold">{item.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {item.full_name} ({item.exchange})
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
