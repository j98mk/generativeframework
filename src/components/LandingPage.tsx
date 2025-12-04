import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-background overflow-hidden flex flex-col">
      <header className="flex flex-row justify-between items-center h-[100px] px-12 bg-background border-b border-border flex-shrink-0">
        <div className="text-2xl font-semibold text-foreground tracking-tight flex items-center leading-none">
          framework
        </div>
        <Button onClick={onLoginClick} size="default">
          Login
        </Button>
      </header>

      <main className="flex-1 flex justify-center items-center p-8">
        <h1 className="text-5xl font-light text-foreground tracking-tight">
          Willkommen
        </h1>
      </main>
    </div>
  );
}
