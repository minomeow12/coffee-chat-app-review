import { Coffee } from "lucide-react";

export function AppLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
          <Coffee className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
