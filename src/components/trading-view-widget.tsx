'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
  onSymbolChange: (symbol: string) => void;
}

function TradingViewWidget({ symbol, interval, containerId, onSymbolChange }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const createWidget = () => {
      if (typeof window.TradingView === 'undefined' || !containerRef.current) {
        return;
      }

      // If a widget already exists in this container, remove it before creating a new one
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

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
            "volumePaneSize": "hidden",
        },
        onChartReady: (chart: any) => {
          chart.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
            if (onSymbolChange && newSymbol.ticker && newSymbol.ticker.toUpperCase() !== symbol.toUpperCase()) {
              onSymbolChange(newSymbol.ticker);
            }
          });
        },
      };

      const widget = new window.TradingView.widget(widgetOptions);
      widgetRef.current = widget;
    };

    const loadScript = () => {
      const scriptId = 'tradingview-widget-script';
      if (document.getElementById(scriptId) && typeof window.TradingView !== 'undefined') {
        // If script is already loaded, just create the widget
        createWidget();
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget;
      script.onerror = () => console.error("TradingView script failed to load.");
      document.head.appendChild(script);
    };

    if (containerRef.current) {
        loadScript();
    }
    
    // Cleanup function to remove the widget on component unmount
    return () => {
      if (widgetRef.current) {
        try {
            widgetRef.current.remove();
        } catch(e) {
            // In some hot-reload scenarios, this can error, but it's safe to ignore
        }
        widgetRef.current = null;
      }
    };
  }, [containerId]); // Only re-create the widget if the containerId changes

  // Effect to update symbol
  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart === 'function') {
      const chart = widgetRef.current.chart();
      if(chart.symbol() !== symbol) {
        chart.setSymbol(symbol, () => {});
      }
    }
  }, [symbol]);

  // Effect to update interval
  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart === 'function') {
       const chart = widgetRef.current.chart();
       if(chart.resolution() !== interval) {
        chart.setResolution(interval, () => {});
       }
    }
  }, [interval]);

  return (
    <div className="tradingview-widget-container h-full w-full border border-gray-200 rounded-md overflow-hidden">
      <div id={containerId} ref={containerRef} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
