'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
  onSymbolChange: (symbol: string) => void;
}

function TradingViewWidget({ symbol, interval, containerId, onSymbolChange }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const createWidget = () => {
      if (!container.current || widgetRef.current || typeof (window as any).TradingView === 'undefined') {
        return;
      }
      
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
        studies: [], // Ensure no default studies are loaded
        overrides: {
            "paneProperties.legendProperties.showLegend": true,
            "paneProperties.legendProperties.showStudyArguments": true,
            "paneProperties.legendProperties.showStudyTitles": true,
            "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.legendProperties.showSeriesTitle": true,
            "paneProperties.legendProperties.showSeriesOHLC": true,
            "mainSeriesProperties.style": 1,
            "mainSeriesProperties.showPriceLine": false, // From previous request
            "volumePaneSize": "tiny", // Hide volume pane
        },
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
    };

    const initialize = () => {
        if (typeof (window as any).TradingView !== 'undefined') {
            createWidget();
        } else {
            const scriptId = 'tradingview-widget-script-advanced';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = "https://s3.tradingview.com/tv.js";
                script.type = "text/javascript";
                script.async = true;
                script.onload = createWidget;
                document.head.appendChild(script);
            }
        }
    };
    
    initialize();

    return () => {
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

  return (
    <div className="tradingview-widget-container h-full w-full">
      <div id={containerId} ref={container} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);