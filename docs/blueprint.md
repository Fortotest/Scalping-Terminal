# **App Name**: ProTrade Terminal

## Core Features:

- Symbol Search: Enables users to search for trading symbols using the TradingView API, with results displayed in an auto-completing search bar.
- Historical Data Charting: Displays historical price data for the selected symbol using the Lightweight Charts library, fetched via the TradingView REST API.
- Real-time Price Updates: Streams real-time price data for the selected symbol using Firebase Realtime Database, sourced from the TradingView API, updating the chart and price ticker dynamically.
- Multi-Timeframe Analysis: Presents the same symbol across four different timeframes (H4, H1, M15, M5) in a 2x2 grid, facilitating multi-timeframe analysis.
- API Key Authentication: Securely authenticates API requests to TradingView's services using the provided API key, stored in Firebase Environment Variables.
- Symbol Information Retrieval: Gathers detailed information about trading instruments through a tool leveraging TradingView's API, aiding users with comprehensive trading context.
- Optimized Firebase Backend: Implements Firebase Cloud Functions in the 'us-central1' region, with caching layers to minimize latency when communicating with TradingView's servers.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A), evoking trust and stability for financial data.
- Background color: Dark gray (#0F172A), providing contrast to improve readability.
- Accent color: Bright cyan (#06BCC1), used for interactive elements and highlights, indicating real-time updates.
- Body and headline font: 'Inter', a sans-serif font, chosen for its modern, neutral appearance that ensures readability of market data and interface elements.
- Code font: 'Source Code Pro' for displaying configuration details.
- Consistent use of minimalist icons from Lucide to represent different chart timeframes, analysis tools, and interactive elements.
- Responsive layout adapting to different screen sizes, featuring a 2x2 grid for the multi-timeframe charts, optimized for desktop and mobile devices.
- Subtle animations on chart updates and transitions to provide smooth visual feedback.