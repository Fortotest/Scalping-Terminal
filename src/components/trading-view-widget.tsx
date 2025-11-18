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
          show_volume: false,
        };

        const widget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = widget;
        
        widget.onChartReady(() => {
          widget.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
              if (onSymbolChange && newSymbol.ticker && newSymbol.ticker !== symbol) {
                  onSymbolChange(newSymbol.ticker);
              }
          });
        });
      }
    };
    
    const initialize = () => {
      if (document.getElementById(containerId)?.childElementCount === 0) {
        createWidget();
      } else if (widgetRef.current) {
          try {
              widgetRef.current.setSymbol(symbol, interval, () => {});
          } catch (error) {
              console.error('Error setting symbol, re-creating widget:', error);
              if (widgetRef.current.remove) {
                widgetRef.current.remove();
              }
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
      script.onload = initialize; // Initialize after script loads
      document.head.appendChild(script);
    }
    
    // Cleanup function when component unmounts or dependencies change
    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
          widgetRef.current = null;
        } catch (error) {
          // It's possible the widget is already gone if the page is navigating away
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
