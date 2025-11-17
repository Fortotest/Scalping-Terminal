'use client';

import TradingViewWidget from './trading-view-widget';

interface Props {
  symbol: string;
}

export default function MultiChartGrid({ symbol }: Props) {
  const charts = [
    { id: 'h4-chart', title: 'H4 • BIG TREND', interval: '240', borderColor: 'border-emerald-500/50', textColor: 'text-emerald-400' },
    { id: 'h1-chart', title: 'H1 • KEY LEVELS', interval: '60', borderColor: 'border-blue-500/50', textColor: 'text-blue-400' },
    { id: 'm15-chart', title: 'M15 • PATTERNS', interval: '15', borderColor: 'border-purple-500/50', textColor: 'text-purple-400' },
    { id: 'm5-chart', title: 'M5 • ENTRY', interval: '5', borderColor: 'border-cyan-500/50', textColor: 'text-cyan-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-0 h-full min-h-[calc(100vh-4rem)]">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="relative w-full h-full flex flex-col border-t border-slate-800"
        >
          <div className={`absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md border ${chart.borderColor}`}>
            <div className={`${chart.textColor} font-bold text-sm tracking-wider`}>
              {chart.title}
            </div>
          </div>
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
