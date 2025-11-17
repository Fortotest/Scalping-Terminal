"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketAnalysisPanel() {
  // Mock data for demonstration. In a real application, this would be calculated.
  const analysis = [
    {
      timeframe: "H4",
      trend: "Bullish",
      condition: "Strong Trend",
      probability: 75,
    },
    {
      timeframe: "H1",
      trend: "Bullish",
      condition: "Correction Possible",
      probability: 60,
    },
    {
      timeframe: "M15",
      trend: "Ranging",
      condition: "Consolidating",
      probability: 45,
    },
    {
      timeframe: "M5",
      trend: "Bearish",
      condition: "Weak Momentum",
      probability: 65,
    },
  ];

  const getTrendColor = (trend: string) => {
    if (trend === "Bullish") return "text-emerald-500";
    if (trend === "Bearish") return "text-red-500";
    return "text-slate-500";
  };
  
  const getTrendIcon = (trend: string) => {
    if (trend === "Bullish") return <TrendingUp className="w-5 h-5" />;
    if (trend === "Bearish") return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  }

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4 w-full">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center text-lg font-semibold text-foreground mb-4">
          Multi-Timeframe Market Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.map((item) => (
            <div
              key={item.timeframe}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-foreground">{item.timeframe}</span>
                <div className={`flex items-center gap-2 font-semibold ${getTrendColor(item.trend)}`}>
                  {getTrendIcon(item.trend)}
                  <span>{item.trend}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="font-medium text-foreground">{item.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-muted-foreground">Probability:</span>
                   <div className="w-2/3 bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${item.probability}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
