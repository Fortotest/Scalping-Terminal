import { NextResponse } from 'next/server';

// This is a mock implementation. In a real application, you would use a library like axios
// to fetch data from the TradingView API using your API key.

const mockSymbols = [
  { symbol: 'AAPL', full_name: 'Apple Inc.', description: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'GOOGL', full_name: 'Alphabet Inc.', description: 'Alphabet Inc. Class A', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'MSFT', full_name: 'Microsoft Corporation', description: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'AMZN', full_name: 'Amazon.com, Inc.', description: 'Amazon.com, Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'TSLA', full_name: 'Tesla, Inc.', description: 'Tesla, Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'BTC/USD', full_name: 'Bitcoin / US Dollar', description: 'Bitcoin to US Dollar', exchange: 'COINBASE', type: 'crypto' },
  { symbol: 'ETH/USD', full_name: 'Ethereum / US Dollar', description: 'Ethereum to US Dollar', exchange: 'KRAKEN', type: 'crypto' },
  { symbol: 'EUR/USD', full_name: 'EUR / USD', description: 'Euro to US Dollar', exchange: 'FXCM', type: 'forex' },
  { symbol: 'GBP/USD', full_name: 'GBP / USD', description: 'British Pound to US Dollar', exchange: 'OANDA', type: 'forex' },
  { symbol: 'ES1!', full_name: 'E-Mini S&P 500 Futures', description: 'S&P 500 Futures', exchange: 'CME', type: 'futures' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    // In a real app, you would call the TradingView search API here
    // const tvApiUrl = `${process.env.TRADINGVIEW_REST_ENDPOINT}/symbols/search?query=${query}&limit=50`;
    // const response = await axios.get(tvApiUrl, { headers: { 'Authorization': `Bearer ${process.env.TRADINGVIEW_API_KEY}` } });
    // const results = response.data;
    
    // For now, filter mock data
    const filteredResults = mockSymbols.filter(s => 
        s.symbol.toLowerCase().includes(query.toLowerCase()) || 
        s.full_name.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({ symbols: filteredResults });
    
  } catch (error) {
    console.error('Symbol search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
