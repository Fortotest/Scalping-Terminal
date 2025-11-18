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

  // This effect handles the creation and removal of the widget.
  useEffect(() => {
    const createWidget = () => {
      // Ensure the container exists and we haven't created a widget in this specific component instance yet.
      if (document.getElementById(containerId) && !widgetRef.current) {
        
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
          withdateranges: true,
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
            // Hide volume by default by setting its pane size to a very small value
             "volumePaneSize": "tiny", 
          },
          onChartReady: () => {
            const widget = widgetRef.current;
            if (widget) {
                // This is a one-time subscription
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

    // Load the script and then create the widget.
    loadTradingViewScript.then(() => {
      createWidget();
    });

    // Cleanup function to remove the widget when the component unmounts.
    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.error("Error removing widget:", e);
        }
        widgetRef.current = null;
      }
    };
    // The dependency array ensures this effect runs once per component instance.
  }, [containerId, onSymbolChange, symbol, interval]); 

  // This separate effect handles symbol changes on an already created widget.
  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart) {
        widgetRef.current.chart().setSymbol(symbol, () => {
            // Optional callback after symbol is set
        });
    }
  }, [symbol]);

  // This separate effect handles interval changes on an already created widget.
  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart) {
        widgetRef.current.chart().setResolution(interval, () => {
            // Optional callback after interval is set
        });
    }
  }, [interval]);

  return (
    <div className="tradingview-widget-container h-full w-full">
      {/* The containerId must be on this div for TradingView to find it */}
      <div id={containerId} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
