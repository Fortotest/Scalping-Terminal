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
          // The 'studies' array can be used to add indicators by default
          studies: [],
          // These features can be adjusted to show/hide UI elements
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          // onChartReady is the correct callback to use
          onChartReady: function() {
            const widget = widgetRef.current;
            if (widget && onSymbolChange) {
              widget.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
                if (newSymbol.ticker && newSymbol.ticker !== symbol) {
                  onSymbolChange(newSymbol.ticker);
                }
              });
            }
          },
        };

        // Create the widget
        const widget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = widget;

      }
    };
    
    // If the widget script is already loaded, create the widget
    if (document.getElementById('tradingview-widget-script-advanced')) {
      // If widget already exists, just update the symbol
      if (widgetRef.current && widgetRef.current.setSymbol) {
        widgetRef.current.setSymbol(symbol, interval, () => {});
      } else {
        createWidget();
      }
    } else {
      // Otherwise, load the script and then create the widget
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
