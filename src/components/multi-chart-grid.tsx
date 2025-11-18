'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export default function MultiChartGrid({ symbol, onSymbolChange }: Props) {
  const charts = [
    { id: 'chart-h4', interval: '240' },
    { id: 'chart-h1', interval: '60' },
    { id: 'chart-m15', interval: '15' },
    { id: 'chart-m5', interval: '5' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[calc(100vh-1rem)] flex-grow">
      {charts.map((chart) => (
          <TradingViewWidget
            key={chart.id}
            symbol={symbol}
            interval={chart.interval}
            containerId={chart.id}
            onSymbolChange={onSymbolChange}
          />
      ))}
    </div>
  );
}
