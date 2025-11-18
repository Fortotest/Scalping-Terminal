'use client';

import { useState } from 'react';
import MultiChartGrid from '@/components/multi-chart-grid';
import SymbolSelector from '@/components/symbol-selector';

export default function Home() {
  // The default symbol can be changed here
  const [symbol, setSymbol] = useState("OANDA:XAUUSD");

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-2">
      <header className="flex justify-center p-2">
        <SymbolSelector
          initialSymbol={symbol}
          onSymbolChange={handleSymbolChange}
        />
      </header>
      <main className="flex-grow">
        <MultiChartGrid symbol={symbol} />
      </main>
    </div>
  );
}
