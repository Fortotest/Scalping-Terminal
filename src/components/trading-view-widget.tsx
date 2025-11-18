'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval: string;
  containerId: string;
  onSymbolChange: (symbol: string) => void;
}

function TradingViewWidget({ symbol, interval, containerId, onSymbolChange }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const createWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView && containerRef.current) {
        if (widgetRef.current) {
            widgetRef.current.remove();
            widgetRef.current = null;
        }

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
          container_id: containerId,
          withdateranges: false,
          hide_top_toolbar: false,
          save_image: false,
          studies: [],
          overrides: {
            "paneProperties.legendProperties.showLegend": true,
            "paneProperties.legendProperties.showStudyArguments": true,
            "paneProperties.legendProperties.showStudyTitles": true,
            "paneProperties.legendProperties.showStudyValues": true,
            "paneProperties.legendProperties.showSeriesTitle": true,
            "paneProperties.legendProperties.showSeriesOHLC": true,
            "mainSeriesProperties.style": 1,
            "mainSeriesProperties.showPriceLine": false,
            "volumePaneSize": "hidden",
            "study.volume.visible": false,
            "study.vol.visible": false,
            "mainSeriesProperties.showVolume": false
          },
          // --- START OF FIX ---
          // onChartReady is a callback property within the widget options
          onChartReady: () => {
            if (widgetRef.current) {
              widgetRef.current.subscribe('symbol_change', (newSymbol: { ticker: string }) => {
                if (onSymbolChange && newSymbol.ticker && newSymbol.ticker.toUpperCase() !== symbol.toUpperCase()) {
                  onSymbolChange(newSymbol.ticker);
                }
              });
            }
          },
          // --- END OF FIX ---
        };

        const widget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = widget;
      }
    };

    const loadScript = () => {
        const scriptId = 'tradingview-widget-script';
        if (document.getElementById(scriptId)) {
            if (typeof (window as any).TradingView !== 'undefined') {
                createWidget();
            }
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = createWidget;
        document.head.appendChild(script);
    };

    loadScript();

    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [containerId, onSymbolChange, symbol, interval]); // Dependencies that trigger re-creation

  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart === 'function') {
        widgetRef.current.chart().setSymbol(symbol, () => {});
    }
  }, [symbol]);

  useEffect(() => {
    if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart === 'function') {
        widgetRef.current.chart().setResolution(interval, () => {});
    }
  }, [interval]);

  return (
    <div className="tradingview-widget-container h-full w-full border border-gray-200 rounded-md overflow-hidden">
      <div id={containerId} ref={containerRef} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
