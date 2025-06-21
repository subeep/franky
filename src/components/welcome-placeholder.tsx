import { Terminal } from 'lucide-react';

export function WelcomePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
      <Terminal className="h-16 w-16 text-primary mb-4" />
      <h2 className="text-2xl font-semibold font-headline text-foreground">
        Ready for Liftoff?
      </h2>
      <p className="mt-2 max-w-sm">
        Enter a DevOps task above, and we'll generate a clear, step-by-step guide to get you started.
      </p>
    </div>
  );
}
