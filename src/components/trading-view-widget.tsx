'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
}

function TradingViewWidget({ symbol, interval, containerId }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined' || !container.current) {
      return;
    }

    // Clean up previous widget if symbol or interval changes
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": interval,
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": true,
      "allow_symbol_change": false,
      "container_id": containerId,
      "hide_volume": true,
      "studies": [],
      "withdateranges": false
    });
    
    container.current.appendChild(script);

    return () => {
      // Cleanup on component unmount
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, interval, containerId]);

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
