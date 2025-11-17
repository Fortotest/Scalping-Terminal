import { NextResponse } from 'next/server';
import { getSymbolInformation } from '@/ai/flows/symbol-information-retrieval';

// This is an in-memory cache for demonstration.
// In a production app, you might use Redis, Memcached, or a database like Firestore/Upstash.
const symbolCache = new Map();
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
  }

  try {
    // Check cache first
    if (symbolCache.has(symbol)) {
      const cached = symbolCache.get(symbol);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
      }
    }

    // If not in cache or expired, fetch from the GenAI flow
    const info = await getSymbolInformation({ symbol });

    // Store in cache
    symbolCache.set(symbol, {
      data: info,
      timestamp: Date.now(),
    });

    return NextResponse.json(info);

  } catch (error: any) {
    console.error(`Symbol info error for ${symbol}:`, error);
    return NextResponse.json({ error: `Failed to fetch symbol info: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
