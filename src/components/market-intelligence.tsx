"use client";
import { useState, useEffect } from "react";
import {
  Target,
  Bell,
  Shield,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function MarketIntelligence() {
  // Mock state for demonstration
  const [risk, setRisk] = useState(2);

  return (
    <div className="border-t border-border bg-background p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Multi-timeframe Confluence */}
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Target className="text-blue-500" size={20} />
            Multi-Timeframe Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>H4 Trend</span>
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                BULLISH <TrendingUp size={16} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>H1 Key Level</span>
              <span className="font-semibold text-blue-500">SUPPORT</span>
            </div>
            <div className="flex justify-between">
              <span>M15 Pattern</span>
              <span className="font-semibold text-purple-500">
                DOUBLE BOTTOM
              </span>
            </div>
            <div className="flex justify-between">
              <span>M5 Entry</span>
              <span className="font-bold text-yellow-500">WAIT</span>
            </div>
          </div>
        </div>

        {/* Center Column - Trading Signals */}
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Bell className="text-yellow-500" size={20} />
            Live Trading Signals
          </h3>
          <div className="space-y-3 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-3">
            <div className="text-center font-bold text-emerald-400">
              STRONG BUY SIGNAL
            </div>
            <div className="flex justify-between text-sm">
              <span>Entry Price:</span>
              <span className="font-mono">1955.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Stop Loss:</span>
              <span className="font-mono text-red-500">1945.20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Take Profit:</span>
              <span className="font-mono text-green-500">1975.00</span>
            </div>
             <div className="flex justify-between text-sm">
              <span>Risk/Reward:</span>
              <span className="font-mono">1:2</span>
            </div>
          </div>
           <div className="text-xs text-muted-foreground">
              RSI(14) is neutral. MACD shows bullish cross. Volume is above average.
            </div>
        </div>

        {/* Right Column - Risk Management */}
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="text-green-500" size={20} />
            Trade Execution
          </h3>
          <div>
            <label className="text-sm">Account Balance</label>
            <input
              type="text"
              defaultValue="$10,000"
              className="mt-1 w-full rounded-md border bg-background p-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm">Risk Percentage: {risk}%</label>
            <input
              type="range"
              min="1"
              max="5"
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>
          <div className="text-center text-sm">
            Calculated Position Size: <span className="font-bold">0.50 Lots</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-md bg-emerald-500 p-2 text-sm font-bold text-white">
              EXECUTE LONG
            </button>
            <button className="rounded-md bg-red-500 p-2 text-sm font-bold text-white">
              EXECUTE SHORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
