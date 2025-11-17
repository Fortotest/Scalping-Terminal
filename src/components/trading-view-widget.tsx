'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
}

function TradingViewWidget({ symbol, interval, containerId }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = React.useState('light');

  useEffect(() => {
    // Detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "container_id": containerId,
      "hide_volume": true,
      "studies": [],
      "withdateranges": false,
      "hide_top_toolbar": false
    });
    
    container.current.appendChild(script);

    return () => {
      // Cleanup on component unmount
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, interval, containerId, theme]);

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
