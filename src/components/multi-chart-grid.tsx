'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'top-left-chart', interval: '240' },
    { id: 'top-right-chart', interval: '60' },
    { id: 'bottom-left-chart', interval: '15' },
    { id: 'bottom-right-chart', interval: '5' }
  ];

  return (
    <div className="flex flex-wrap h-screen">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="w-full md:w-1/2 h-1/2 border-t border-border"
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
