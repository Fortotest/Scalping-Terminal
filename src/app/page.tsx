'use client';

import MultiChartGrid from '@/components/multi-chart-grid';
import MarketAnalysisPanel from '@/components/market-analysis-panel';

export default function Home() {
  // The default symbol can be changed here
  const symbol = "OANDA:XAUUSD";

  return (
    <div className="relative min-h-screen bg-background">
      <main className="h-screen pb-40">
        <MultiChartGrid symbol={symbol} />
      </main>
      <div className="absolute bottom-0 left-0 right-0">
        <MarketAnalysisPanel />
      </div>
    </div>
  );
}
