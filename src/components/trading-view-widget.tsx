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
    const createWidget = () => {
      if (!container.current || widgetRef.current || typeof (window as any).TradingView === 'undefined') {
        return;
      }

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
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        withdateranges: true,
        hide_top_toolbar: false,
        save_image: false,
        container_id: containerId,
        studies_overrides: {
          "volume.volume.plottype": "line",
        },
        overrides: {
            "paneProperties.legendProperties.showLegend": true,
            "paneProperties.legendProperties.showStudyArguments": true,
            "paneProperties.legendProperties.showStudyTitles": true,
            "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.legendProperties.showSeriesTitle": true,
            "paneProperties.legendProperties.showSeriesOHLC": true,
            "mainSeriesProperties.style": 1, // Candles,
            "volume.volume.color.0": "rgba(255, 0, 0, 0.0)",
            "volume.volume.color.1": "rgba(0, 255, 0, 0.0)",
        },
        studies: [], // Remove default volume
        onChartReady: function() {
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
    };
    
    const scriptId = 'tradingview-widget-script-advanced';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = createWidget; // Create widget after script is loaded
      document.head.appendChild(script);
    } else {
      // If script is already there but window.TradingView might not be ready, wait for it.
      const checkTV = setInterval(() => {
        if ((window as any).TradingView) {
          clearInterval(checkTV);
          createWidget();
        }
      }, 100);
    }

    return () => {
      // Cleanup widget on component unmount
      if (widgetRef.current && widgetRef.current.remove) {
        try {
          widgetRef.current.remove();
        } catch(e) {
          console.error("Error removing widget:", e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, containerId, onSymbolChange]);

  // Use a key to ensure React re-creates the component on symbol change
  return (
    <div key={symbol + containerId} className="tradingview-widget-container h-full w-full">
      <div id={containerId} ref={container} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
