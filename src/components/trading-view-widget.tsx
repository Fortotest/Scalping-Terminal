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
  const isMounted = useRef(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || !container.current) {
      return;
    }

    if (isMounted.current) {
        // If widget already exists, just update the symbol
        const widget = (window as any).TradingView.widgets[containerId];
        if (widget && widget.setSymbol) {
            widget.setSymbol(symbol, interval, () => {
                console.log(`Symbol set to ${symbol} on widget ${containerId}`);
            });
            return;
        }
    }

    // Clean up previous widget if symbol or interval changes
    container.current.innerHTML = '';

    const widgetOptions = {
      "autosize": true,
      "symbol": symbol,
      "interval": interval,
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "hide_top_toolbar": false,
      "hide_legend": true,
      "show_volume": false,
      "container_id": containerId,
      "studies": [],
      "disabled_features": ["use_localstorage_for_settings"],
      "enabled_features": ["study_templates"]
    };

    const createWidget = () => {
      if ('TradingView' in window && (window.TradingView as any).widget) {
        const widget = new (window as any).TradingView.widget(widgetOptions);
        
        // Store widget instance for symbol updates
        if (!(window as any).TradingView.widgets) {
          (window as any).TradingView.widgets = {};
        }
        (window as any).TradingView.widgets[containerId] = widget;

        widget.onChartReady(() => {
          widget.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
              if (onSymbolChange && newSymbol.ticker) {
                  onSymbolChange(newSymbol.ticker);
              }
          });
        });
        isMounted.current = true;
      }
    };

    if (document.getElementById('tradingview-widget-script-advanced')) {
        createWidget();
    } else {
        const script = document.createElement("script");
        script.id = 'tradingview-widget-script-advanced';
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = createWidget;
        document.head.appendChild(script);
    }
    
    // No cleanup function needed as we are now updating the widget instance
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
