'use client';

import { useState, useEffect } from 'react';
import tvClient from '@/lib/tradingview-api';
import type { SymbolInformationOutput } from '@/ai/flows/symbol-information-retrieval';
import { Skeleton } from './ui/skeleton';

interface Props {
  symbol: string;
  info: SymbolInformationOutput | null;
}

interface QuoteData {
  price: number;
  change: number;
  change_percent: number;
}

export default function RealtimePriceDisplay({ symbol, info }: Props) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    const fetchQuote = async () => {
      try {
        const quoteData = await tvClient.getRealtimeQuote(symbol);
        setQuote(quoteData);
      } catch (error) {
        console.error('Failed to fetch real-time quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  const changeColor = quote && quote.change >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = quote && quote.change >= 0 ? '+' : '';

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground truncate" title={info?.full_name}>
          {info?.full_name || <Skeleton className="h-8 w-48" />}
        </h2>
        <p className="text-sm text-muted-foreground">
          {info?.exchange}: {info?.symbol}
        </p>
      </div>
      <div className="flex items-end gap-4">
        {loading || !quote ? (
          <div className="flex items-end gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : (
          <>
            <span className="text-2xl md:text-3xl font-semibold text-foreground">
              {quote.price.toFixed(2)}
            </span>
            <span className={`text-lg font-medium ${changeColor}`}>
              {changeSign}{quote.change.toFixed(2)} ({changeSign}{quote.change_percent.toFixed(2)}%)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
