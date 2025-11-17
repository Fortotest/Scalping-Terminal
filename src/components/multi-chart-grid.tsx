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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full flex-grow">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="bg-card rounded-lg overflow-hidden flex flex-col h-[45vh]"
          style={{ minHeight: '400px' }}
        >
          <div className="p-3 bg-card-foreground/5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{chart.label} - {symbol}</h3>
          </div>
          <div className="flex-grow">
            <TradingViewWidget
              symbol={symbol}
              interval={chart.interval}
              containerId={chart.id}
              theme="dark"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
