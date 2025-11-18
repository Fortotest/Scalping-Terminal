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
      if (typeof window !== 'undefined' && 'TradingView' in window && container.current) {
        
        const widgetOptions = {
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          save_image: false,
          show_volume: false,
          hide_legend: false,
          container_id: containerId,
          studies: [],
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          onChartReady: () => {
            const widget = widgetRef.current;
            if (widget && onSymbolChange) {
                // The documentation is not clear on the type, so we need to be defensive
                const chart = widget.chart ? widget.chart() : widget;
                chart.onSymbolChanged().subscribe(null, (newSymbol: { name: string }) => {
                    const newTicker = newSymbol.name;
                    if (newTicker && newTicker !== symbol) {
                        onSymbolChange(newTicker);
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
        if (widgetRef.current) {
            try {
                widgetRef.current.setSymbol(symbol, interval, () => {});
            } catch (error) {
                console.error('Error setting symbol, re-creating widget:', error);
                widgetRef.current.remove();
                widgetRef.current = null;
                createWidget();
            }
        } else {
            createWidget();
        }
    };
    
    if (document.getElementById('tradingview-widget-script-advanced')) {
        initialize();
    } else {
      const script = document.createElement("script");
      script.id = 'tradingview-widget-script-advanced';
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
          widgetRef.current = null;
        } catch (error) {
          console.error('Error removing widget on cleanup:', error);
        }
      }
    };
  }, [symbol, interval, containerId, onSymbolChange]);

  return (
    <div
      id={containerId}
      className="tradingview-widget-container h-full w-full"
      ref={container}
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
}

export default memo(TradingViewWidget);