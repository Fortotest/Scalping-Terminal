'use client';

export default function Home() {
  // The default symbol can be changed here
  const symbol = "OANDA:XAUUSD";

  return (
    <div className="flex flex-col min-h-screen bg-background p-2">
      <main className="flex-grow">
        {/* The chart grid has been removed as requested. */}
      </main>
    </div>
  );
}
