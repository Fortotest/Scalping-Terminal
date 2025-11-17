'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'h4-chart', interval: '240' },
    { id: 'h1-chart', interval: '60' },
    { id: 'm15-chart', interval: '15' },
    { id: 'm5-chart', interval: '5' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-0 h-full min-h-[calc(100vh-4rem)]">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="relative w-full h-full flex flex-col border-t border-border"
        >
          <TradingViewWidget
            symbol={symbol}
            interval={chart.interval}
            containerId={chart.id}
          />
        </div>
      ))}
    </div>
  );
}
