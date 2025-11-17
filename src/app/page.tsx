'use client';

import Header from '@/components/header';
import MultiChartGrid from '@/components/multi-chart-grid';

export default function Home() {
  // The default symbol can be changed here
  const symbol = "OANDA:XAUUSD";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <MultiChartGrid symbol={symbol} />
      </main>
    </div>
  );
}
