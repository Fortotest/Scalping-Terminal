import { NextResponse } from 'next/server';

// This is a mock implementation. In a real application, you would use a library like axios
// to fetch data from the TradingView API using your API key.

// Store mock prices to simulate some continuity
const mockPriceStore: { [key: string]: { price: number; change: number } } = {};

const generateMockQuote = (symbol: string) => {
  const lastQuote = mockPriceStore[symbol];
  let price;
  if (lastQuote) {
    price = lastQuote.price * (1 + (Math.random() - 0.5) * 0.01); // Fluctuate by up to 1%
  } else {
    price = Math.random() * 500 + 100;
  }
  const change = lastQuote ? price - (lastQuote.price - lastQuote.change) : (Math.random() - 0.5) * 10;
  const openPrice = price - change;
  const change_percent = (change / openPrice) * 100;
  
  const newQuote = { price, change };
  mockPriceStore[symbol] = newQuote;

  return {
    symbol,
    price: parseFloat(price.toFixed(2)),
    bid: parseFloat((price * 0.999).toFixed(2)),
    ask: parseFloat((price * 1.001).toFixed(2)),
    volume: Math.floor(Math.random() * 1000000),
    change: parseFloat(change.toFixed(2)),
    change_percent: parseFloat(change_percent.toFixed(2)),
    timestamp: Date.now(),
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
  }

  try {
    // In a real app, call TradingView:
    // const response = await axios.get(`${process.env.TRADINGVIEW_REST_ENDPOINT}/quotes/${symbol}`, ...);
    
    // For now, return mock data
    const quote = generateMockQuote(symbol);

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Real-time quote error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const { symbols } = await request.json();
    
        if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
          return NextResponse.json({ error: 'Symbols array required' }, { status: 400 });
        }
        
        if (symbols.length > 50) {
          return NextResponse.json({ error: 'Maximum 50 symbols per request' }, { status: 400 });
        }
        
        // In a real app, call TradingView batch quotes
        // const response = await axios.post(`${process.env.TRADINGVIEW_REST_ENDPOINT}/quotes/batch`, { symbols }, ...);

        const quotes = symbols.reduce((acc: any, symbol: string) => {
            acc[symbol] = generateMockQuote(symbol);
            return acc;
        }, {});

        return NextResponse.json(quotes);

    } catch (error) {
        console.error('Batch quotes error:', error);
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}
