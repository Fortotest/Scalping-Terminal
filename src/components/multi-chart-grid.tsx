'use client';

import TradingViewChart from './trading-view-chart';
import { Card } from './ui/card';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'h4', label: 'H4 • BIG TREND', interval: '240', color: 'text-chart-1' },
    { id: 'h1', label: 'H1 • KEY LEVELS', interval: '60', color: 'text-chart-2' },
    { id: 'm15', label: 'M15 • PATTERNS', interval: '15', color: 'text-chart-3' },
    { id: 'm5', label: 'M5 • ENTRY', interval: '5', color: 'text-primary' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-2 h-full min-h-[100vh] md:min-h-0">
      {charts.map((chart) => (
        <Card 
          key={chart.id}
          className="relative bg-card overflow-hidden w-full h-full flex flex-col"
        >
          <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md border">
            <div className={`${chart.color} font-bold text-sm tracking-wider`}>
              {chart.label}
            </div>
          </div>
          <TradingViewChart 
            symbol={symbol} 
            interval={chart.interval}
          />
        </Card>
      ))}
    </div>
  );
}
