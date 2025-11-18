'use client';

import { useState } from 'react';
import MultiChartGrid from '@/components/multi-chart-grid';

export default function Home() {
  // The default symbol can be changed here
  const [symbol, setSymbol] = useState("OANDA:XAUUSD");

  // This function will be passed to the widgets to sync the symbol
  const handleSymbolChange = (newSymbol: string) => {
    // Prevent unnecessary re-renders if the symbol is the same
    if (newSymbol !== symbol) {
        console.log(`Symbol changed from ${symbol} to ${newSymbol}`);
        setSymbol(newSymbol);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-2">
      <main className="flex-grow">
        <MultiChartGrid symbol={symbol} onSymbolChange={handleSymbolChange} />
      </main>
    </div>
  );
}
