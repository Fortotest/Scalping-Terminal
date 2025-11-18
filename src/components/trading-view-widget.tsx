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
      "hide_top_toolbar": false,
      "hide_side_toolbar": false,
      "hide_volume": true,
      "hideideas": true,
      "studies_overrides": {
        "volume.volume.plottype": "line"
      },
      "studies": [],
      "container_id": containerId,
    });
    
    container.current.appendChild(script);

    // After the script is appended, we need to wait for the iframe to be created
    // and then send a message to it to apply the status line settings.
    const iframeWatcher = setInterval(() => {
      const iframe = container.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        clearInterval(iframeWatcher);
        
        const applySettings = () => {
          // These settings correspond to the checkboxes in your image
          iframe.contentWindow?.postMessage({
            type: 'set-widget-properties',
            properties: {
              "paneProperties.legendProperties.showVolume": false,
              "paneProperties.legendProperties.showLastDayChange": false,
            }
          }, '*');
        };

        // The widget might take some time to initialize fully.
        // We'll try to send the message a few times to make sure it's received.
        setTimeout(applySettings, 1000);
        setTimeout(applySettings, 3000); // Failsafe
      }
    }, 100);

    return () => {
      // Cleanup on component unmount
      if (container.current) {
        container.current.innerHTML = '';
      }
      clearInterval(iframeWatcher);
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
