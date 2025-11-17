'use server';

/**
 * @fileOverview A flow to retrieve detailed information about trading instruments.
 *
 * - getSymbolInformation - A function that retrieves symbol information.
 * - SymbolInformationInput - The input type for the getSymbolInformation function.
 * - SymbolInformationOutput - The return type for the getSymbolInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymbolInformationInputSchema = z.object({
  symbol: z.string().describe('The trading symbol to retrieve information for.'),
});
export type SymbolInformationInput = z.infer<typeof SymbolInformationInputSchema>;

const SymbolInformationOutputSchema = z.object({
  symbol: z.string().describe('The trading symbol.'),
  full_name: z.string().describe('The full name of the symbol.'),
  description: z.string().describe('A description of the symbol.'),
  type: z.string().describe('The type of the symbol (e.g., stock, forex, crypto).'),
  exchange: z.string().describe('The exchange where the symbol is traded.'),
  currency_code: z.string().describe('The currency code of the symbol.'),
  session: z.string().describe('The trading session of the symbol.'),
  timezone: z.string().describe('The timezone of the exchange.'),
  minmov: z.number().describe('The minimum movement of the symbol.'),
  pricescale: z.number().describe('The price scale of the symbol.'),
  has_intraday: z.boolean().describe('Whether the symbol has intraday data.'),
  supported_resolutions: z.string().array().describe('The supported resolutions for the symbol.'),
});
export type SymbolInformationOutput = z.infer<typeof SymbolInformationOutputSchema>;

export async function getSymbolInformation(input: SymbolInformationInput): Promise<SymbolInformationOutput> {
  return symbolInformationFlow(input);
}

const getSymbolInfo = ai.defineTool({
  name: 'getSymbolInfo',
  description: 'Retrieves detailed information about a trading symbol using the TradingView API.',
  inputSchema: z.object({
    symbol: z.string().describe('The trading symbol to retrieve information for (e.g., AAPL).'),
  }),
  outputSchema: SymbolInformationOutputSchema,
},
async (input) => {
  // This is a placeholder implementation; replace with actual TradingView API call
  // to fetch symbol information.
  // In a real implementation, you would use the TradingView API client to
  // fetch the symbol information.

  //For now, return dummy data
  return {
    symbol: input.symbol,
    full_name: `${input.symbol} Company`,
    description: `Description of ${input.symbol}`,
    type: 'stock',
    exchange: 'NASDAQ',
    currency_code: 'USD',
    session: '24x7',
    timezone: 'America/New_York',
    minmov: 1,
    pricescale: 100,
    has_intraday: true,
    supported_resolutions: ["1", "5", "15", "60", "D"]
  };
});

const symbolInformationPrompt = ai.definePrompt({
  name: 'symbolInformationPrompt',
  input: {schema: SymbolInformationInputSchema},
  output: {schema: SymbolInformationOutputSchema},
  tools: [getSymbolInfo],
  prompt: `You are a financial expert. A user is asking for information on a trading symbol. Use the getSymbolInfo tool to get the symbol information, and then respond to the user with a summary of the symbol information.

  Symbol: {{{symbol}}} `,
});

const symbolInformationFlow = ai.defineFlow(
  {
    name: 'symbolInformationFlow',
    inputSchema: SymbolInformationInputSchema,
    outputSchema: SymbolInformationOutputSchema,
  },
  async input => {
    const {output} = await symbolInformationPrompt(input);
    return output!;
  }
);
