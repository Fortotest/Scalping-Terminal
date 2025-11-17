'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, ColorType } from 'lightweight-charts';
import tvClient from '../lib/tradingview-api';

interface Props {
  symbol: string;
  interval: string;
}

export default function TradingViewChart({ symbol, interval }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const computedStyle = getComputedStyle(document.documentElement);
    const textColor = computedStyle.getPropertyValue('--foreground').trim();
    const borderColor = computedStyle.getPropertyValue('--border').trim();

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: `hsl(${textColor})`,
      },
      grid: {
        vertLines: { color: `hsl(${borderColor})` },
        horzLines: { color: `hsl(${borderColor})` },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: `hsl(${borderColor})`,
      },
      rightPriceScale: {
        borderColor: `hsl(${borderColor})`,
      }
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#089981', // green
      downColor: '#f23645', // red
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const to = Math.floor(Date.now() / 1000);
        // Set a reasonable `from` based on interval
        const days = interval === 'D' ? 365 * 2 : (parseInt(interval) > 60 ? 90 : 30);
        const from = to - (60 * 60 * 24 * days); 

        const bars = await tvClient.getHistoricalBars(symbol, interval, from, to);
        
        if (bars && bars.length > 0) {
            const formattedBars = bars.map(bar => ({
              time: bar.time / 1000 as Time,
              open: bar.open,
              high: bar.high,
              low: bar.low,
              close: bar.close,
            }));

            candlestickSeries.setData(formattedBars);
            chart.timeScale().fitContent();
        } else {
            candlestickSeries.setData([]); // Clear data if empty
            setError('No historical data available for this symbol.');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        candlestickSeries.setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.resize(
            chartContainerRef.current.clientWidth,
            chartContainerRef.current.clientHeight
        );
      }
    };
    
    // Initial resize
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, interval]);


  // Effect for real-time updates
  useEffect(() => {
    const updateRealtime = async () => {
        try {
            const quote = await tvClient.getRealtimeQuote(symbol);
            if (seriesRef.current && quote) {
                const data = seriesRef.current.data();
                const lastBar = data[data.length - 1];
                if (lastBar) {
                    const newBar = {
                        ...lastBar,
                        close: quote.price,
                        high: Math.max(lastBar.high, quote.price),
                        low: Math.min(lastBar.low, quote.price)
                    };
                    seriesRef.current.update(newBar);
                }
            }
        } catch (err) {
            // Silently fail on quote update to not disrupt user
            console.error("Quote update failed:", err);
        }
    };

    const intervalId = setInterval(updateRealtime, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [symbol]);


  return (
    <div className="relative w-full h-full flex-grow">
      {(loading || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
          {loading && <div className="text-primary animate-pulse">Loading chart...</div>}
          {error && <div className="text-destructive max-w-xs text-center">{error}</div>}
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
