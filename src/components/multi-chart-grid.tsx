'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'chart-h4', interval: '240', label: 'H4' },
    { id: 'chart-h1', interval: '60', label: 'H1' },
    { id: 'chart-m15', interval: '15', label: 'M15' },
    { id: 'chart-m5', interval: '5', label: 'M5' },
  ];

  return (
    <div className="flex flex-wrap h-full flex-grow">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="w-full md:w-1/2 h-[50vh] border-t border-r border-border"
          style={{ minHeight: '400px' }}
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
