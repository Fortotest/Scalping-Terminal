'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import TradingViewWidget from '@/components/trading-view-widget';
import RealtimePriceDisplay from '@/components/realtime-price-display';
import SymbolSearchBar from '@/components/symbol-search-bar';
import { getSymbolInformation, type SymbolInformationOutput } from '@/ai/flows/symbol-information-retrieval';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolInfo, setSymbolInfo] = useState<SymbolInformationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSymbolInfo() {
      if (!symbol) return;
      setIsLoading(true);
      try {
        // The getSymbolInformation flow needs to be updated to handle forex pairs like 'EURUSD'
        // For now, we will handle the symbol format here.
        const formattedSymbol = symbol.replace('/', '');
        const info = await getSymbolInformation({ symbol: formattedSymbol });
        setSymbolInfo(info);
      } catch (error) {
        console.error("Failed to fetch symbol info:", error);
        setSymbolInfo(null);
      }
      setIsLoading(false);
    }
    fetchSymbolInfo();
  }, [symbol]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8">
        <Card>
          <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <SymbolSearchBar onSymbolSelect={(selected) => setSymbol(selected.symbol)} />
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4">
              {isLoading ? (
                 <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
              ) : (
                <RealtimePriceDisplay symbol={symbol} info={symbolInfo} />
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-grow h-[70vh]">
          {symbol && <TradingViewWidget symbol={symbol} />}
        </div>
      </main>
    </div>
  );
}
