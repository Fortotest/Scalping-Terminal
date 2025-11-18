'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
  onSymbolChange?: (symbol: string) => void;
}

function TradingViewWidget({ symbol, interval, containerId, onSymbolChange }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || !container.current) {
      return;
    }

    const createWidget = () => {
      // Clear the container before creating a new widget
      if (container.current) {
        container.current.innerHTML = '';
      }
      
      if ('TradingView' in window && (window as any).TradingView.widget) {
        const widgetOptions = {
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          withdateranges: true,
          hide_top_toolbar: false,
          save_image: false,
          container_id: containerId,
          show_volume: false,
          onChartReady: () => {
            const widget = widgetRef.current;
            if (widget) {
              widget.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
                if (onSymbolChange && newSymbol.ticker && newSymbol.ticker !== symbol) {
                  onSymbolChange(newSymbol.ticker);
                }
              });
            }
          },
        };

        const widget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = widget;
      }
    };

    const initialize = () => {
      // If widget already exists for the current symbol, don't re-create
      if (widgetRef.current && widgetRef.current.symbol() === symbol) {
        return;
      }
      // If widget exists but symbol is different, update it
      if (widgetRef.current) {
        widgetRef.current.setSymbol(symbol, interval, () => {});
      } else {
        createWidget();
      }
    };

    if (document.querySelector('#tradingview-widget-script-advanced')) {
      initialize();
    } else {
      const script = document.createElement("script");
      script.id = 'tradingview-widget-script-advanced';
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initialize;
      document.head.appendChild(script);
    }

  }, [symbol, interval, containerId, onSymbolChange]);

  // Use a key related to the symbol to force re-mount on symbol change if needed
  return (
    <div key={symbol} className="tradingview-widget-container h-full w-full">
      <div id={containerId} ref={container} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);