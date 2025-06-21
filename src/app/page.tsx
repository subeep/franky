'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rocket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { GuideDisplay } from '@/components/guide-display';
import { GuideSkeleton } from '@/components/guide-skeleton';
import { WelcomePlaceholder } from '@/components/welcome-placeholder';
import { generateAndFormatGuide } from './actions';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  request: z
    .string()
    .min(10, {
      message: 'Your request must be at least 10 characters.',
    })
    .max(200, {
      message: 'Your request must not be longer than 200 characters.',
    }),
});

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [guideTree, setGuideTree] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      request: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null);
    setGuideTree(null);
    setCompletedSteps(new Set());
    
    startTransition(async () => {
      const result = await generateAndFormatGuide(data.request);
      if (result.error) {
        setError(result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setGuideTree(result.guideTree);
      }
    });
  }

  const handleStepToggle = (stepId: string) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  return (
    <main className="container mx-auto max-w-4xl py-12 px-4">
      <header className="text-center">
        <Icons.logo className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          DevOps Guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter a DevOps task below, and our AI will generate a step-by-step
          guide for you.
        </p>
      </header>

      <section className="mt-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Deploy a Next.js app to AWS Amplify'"
                      className="resize-none text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full text-lg py-6"
            >
              {isPending ? (
                <>
                  <Rocket className="mr-2 h-5 w-5 animate-pulse" />
                  Generating...
                </>
              ) : (
                'Generate Guide'
              )}
            </Button>
          </form>
        </Form>
      </section>

      <section className="mt-12 min-h-[300px] rounded-lg border bg-card p-6 shadow-sm">
        {isPending && <GuideSkeleton />}
        {error && !isPending && (
           <Alert variant="destructive">
            <AlertTitle>Error Generating Guide</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isPending && !error && guideTree && (
          <GuideDisplay
            tree={guideTree}
            completedSteps={completedSteps}
            onStepToggle={handleStepToggle}
          />
        )}
        {!isPending && !error && !guideTree && <WelcomePlaceholder />}
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Powered by Google Gemini. Built with Next.js and Firebase.</p>
      </footer>
    </main>
  );
}
