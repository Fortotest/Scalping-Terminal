'use client';

import React, { useEffect, useRef, memo } from 'react';

// A global promise to ensure the TradingView script is loaded only once.
const loadTradingViewScript = new Promise<void>((resolve) => {
  if (typeof window !== 'undefined' && (window as any).TradingView) {
    resolve();
    return;
  }
  const script = document.createElement('script');
  script.id = 'tradingview-widget-script';
  script.src = 'https://s3.tradingview.com/tv.js';
  script.async = true;
  script.onload = () => resolve();
  document.head.appendChild(script);
});


interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
  onSymbolChange: (symbol: string) => void;
}

function TradingViewWidget({ symbol, interval, containerId, onSymbolChange }: TradingViewWidgetProps) {
  const widgetRef = useRef<any>(null);
  // Use a ref to track if the widget has been created for this specific instance.
  const isWidgetCreated = useRef(false);

  useEffect(() => {
    // Only run this effect once per component instance.
    if (isWidgetCreated.current) {
        return;
    }

    let widget: any;

    const createWidget = () => {
      if (document.getElementById(containerId) && 'TradingView' in window && (window as any).TradingView.widget) {
        
        const widgetOptions = {
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          withdateranges: false,
          hide_top_toolbar: false,
          save_image: false,
          container_id: containerId,
          studies: [],
           overrides: {
            "paneProperties.legendProperties.showLegend": true,
            "paneProperties.legendProperties.showStudyArguments": true,
            "paneProperties.legendProperties.showStudyTitles": true,
            "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.legendProperties.showSeriesTitle": true,
            "paneProperties.legendProperties.showSeriesOHLC": true,
            "mainSeriesProperties.style": 1,
            "mainSeriesProperties.showPriceLine": false,
            // Hide the volume indicator completely
            "mainSeriesProperties.showVolume": false,
            "volumePaneSize": "hidden",
          },
        };

        widget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = widget;
        isWidgetCreated.current = true; // Mark as created.

        widget.onChartReady(() => {
            if (widgetRef.current) {
                // Subscribe to symbol changes
                widgetRef.current.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
                  if (onSymbolChange && newSymbol.ticker && newSymbol.ticker !== symbol) {
                    onSymbolChange(newSymbol.ticker);
                  }
                });
            }
        });
      }
    };

    loadTradingViewScript.then(() => {
        createWidget();
    });

    // Cleanup function
    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
      isWidgetCreated.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]); // This effect should only run once when the containerId is stable.

  // This separate effect handles symbol changes on an already created widget.
  useEffect(() => {
    // Ensure the widget is created before trying to change the symbol.
    if (widgetRef.current && widgetRef.current.chart && isWidgetCreated.current) {
      widgetRef.current.chart().setSymbol(symbol, () => {
          // Optional callback after symbol is set
      });
    }
  }, [symbol]);

  // This separate effect handles interval changes on an already created widget.
  useEffect(() => {
    // Ensure the widget is created before trying to change the interval.
    if (widgetRef.current && widgetRef.current.chart && isWidgetCreated.current) {
      widgetRef.current.chart().setResolution(interval, () => {
          // Optional callback after interval is set
      });
    }
  }, [interval]);

  return (
    <div className="tradingview-widget-container h-full w-full border border-gray-200 rounded-md overflow-hidden">
      <div id={containerId} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
