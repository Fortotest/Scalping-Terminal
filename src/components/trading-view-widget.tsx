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
    if (typeof window === 'undefined' || !container.current || !(window as any).TradingView) {
      return;
    }

    const createWidget = () => {
      if (!container.current) return;

      // Clear the container before creating a new widget
      container.current.innerHTML = '';

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
        studies_overrides: {
          "volume.volume.plottype": "line",
          "volume.volume.color.0": "#000000",
          "volume.volume.color.1": "#000000",
          "volume.volume.transparency": 100,
          "volume.options.showStudyArguments": false,
          "volume.options.showStudyTitles": false,
          "volume.options.showStudyValues": false,
          "volume.options.showMA": false,
        },
        overrides: {
            "paneProperties.legendProperties.showLegend": true,
            "paneProperties.legendProperties.showStudyArguments": true,
            "paneProperties.legendProperties.showStudyTitles": true,
            "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.legendProperties.showSeriesTitle": true,
            "paneProperties.legendProperties.showSeriesOHLC": true,
            "mainSeriesProperties.style": 1 // Candles
        },
        studies: [
          // Remove default volume study
        ],
        onChartReady: () => {
          const widget = widgetRef.current;
          if (widget) {
            widget.activeChart().createStudy('Volume', false, false, {}, () => {}, {
              "volume.volume.color.0": "rgba(255, 0, 0, 0.0)",
              "volume.volume.color.1": "rgba(0, 255, 0, 0.0)",
              "volume.volume.plottype": "columns",
              "volume.maLength": 20,
              "volume.showma": false,
              "volume.volume ma.color": "rgba(0, 0, 0, 0)",
              "volume.volume ma.plottype": "line",
              "volume.volume ma.linewidth": 1,
            });

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
    };
    
    const scriptId = 'tradingview-widget-script-advanced';

    if (document.getElementById(scriptId) && (window as any).TradingView) {
      createWidget();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
    }

  }, [symbol, interval, containerId, onSymbolChange]);

  // Use a key related to the symbol to force re-mount on symbol change if needed
  return (
    <div key={symbol + containerId} className="tradingview-widget-container h-full w-full">
      <div id={containerId} ref={container} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);