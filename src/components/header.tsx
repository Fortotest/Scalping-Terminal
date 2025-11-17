import { LineChart } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 lg:px-8 border-b shrink-0 bg-card text-card-foreground">
      <div className="flex items-center gap-2">
        <LineChart className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">ProTrade Terminal</h1>
      </div>
    </header>
  );
}
