'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'chart-h4', interval: '240' },
    { id: 'chart-h1', interval: '60' },
    { id: 'chart-m15', interval: '15' },
    { id: 'chart-m5', interval: '5' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[90vh] flex-grow">
      {charts.map((chart) => (
        <div key={chart.id} className="h-full w-full">
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
