'use client';

import { useState, useEffect, useRef } from 'react';
import tvClient from '@/lib/tradingview-api';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, LoaderCircle } from 'lucide-react';

interface SymbolSearchResult {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
}

interface Props {
  onSymbolSelect: (symbol: SymbolSearchResult) => void;
}

export default function SymbolSearchBar({ onSymbolSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      setIsOpen(true);
      tvClient.searchSymbols(debouncedQuery)
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Search failed:', error);
          setLoading(false);
        });
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (symbol: SymbolSearchResult) => {
    setQuery(symbol.symbol);
    onSymbolSelect(symbol);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search for a symbol (e.g., AAPL)"
          className="pl-10"
        />
        {loading && <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
      </div>
      {isOpen && results.length > 0 && (
        <Card className="absolute z-10 w-full mt-2 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            <ul>
              {results.map(symbol => (
                <li key={`${symbol.symbol}-${symbol.exchange}`}>
                  <button
                    onClick={() => handleSelect(symbol)}
                    className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold">{symbol.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate">{symbol.full_name}</div>
                    <div className="text-xs text-muted-foreground">{symbol.exchange} - {symbol.type}</div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
