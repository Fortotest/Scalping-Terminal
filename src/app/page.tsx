'use client';

import MultiChartGrid from '@/components/multi-chart-grid';
import MarketIntelligence from '@/components/market-intelligence';

export default function Home() {
  // The default symbol can be changed here
  const symbol = "OANDA:XAUUSD";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <MultiChartGrid symbol={symbol} />
        <MarketIntelligence />
      </main>
    </div>
  );
}
