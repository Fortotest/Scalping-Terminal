// This file is a CLIENT-SIDE library for interacting with our OWN backend API routes.

interface ChartBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SymbolSearchResult {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
}

class TradingViewClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  async searchSymbols(query: string, type?: string): Promise<SymbolSearchResult[]> {
    const params = new URLSearchParams({ query });
    if (type) params.append('type', type);
    
    const response = await fetch(
      `${this.baseUrl}/api/tv/search?${params.toString()}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Search failed');
    }
    
    const data = await response.json();
    return data.symbols;
  }
  
  async getHistoricalBars(
    symbol: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<ChartBar[]> {
    const params = new URLSearchParams({
      symbol,
      resolution,
      from: from.toString(),
      to: to.toString()
    });
    
    const response = await fetch(
      `${this.baseUrl}/api/tv/history?${params.toString()}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch bars');
    }
    
    const data = await response.json();
    return data.bars;
  }
  
  async getRealtimeQuote(symbol: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/tv/quotes?symbol=${symbol}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch quote');
    }
    
    return response.json();
  }
}

const tvClient = new TradingViewClient();
export default tvClient;
