'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rocket, ShieldAlert } from 'lucide-react';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { GuideDisplay } from '@/components/guide-display';
import { GuideSkeleton } from '@/components/guide-skeleton';
import { WelcomePlaceholder } from '@/components/welcome-placeholder';
import { generateGuide } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { GenerateDevopsGuideOutput } from '@/ai/flows/generate-devops-guide';

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

const FormattedContent = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|```[^`]+```)/g);
  return (
    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return (
            <pre key={i} className="my-2 rounded-md bg-gray-900 p-3 font-mono text-xs text-gray-200 overflow-x-auto">
              <code>{part.slice(3, -3).trim()}</code>
            </pre>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="mx-0.5 rounded-sm bg-gray-700/50 px-1 py-0.5 font-mono text-xs">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};


export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [guide, setGuide] = useState<GenerateDevopsGuideOutput['guide'] | null>(null);
  const [errors, setErrors] = useState<GenerateDevopsGuideOutput['errors'] | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      request: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setServerError(null);
    setGuide(null);
    setErrors(null);
    
    startTransition(async () => {
      const result = await generateGuide(data.request);
      if (result.error) {
        setServerError(result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setGuide(result.guide);
        setErrors(result.errors);
      }
    });
  }

  return (
    <main className="container mx-auto max-w-4xl py-12 px-4">
      <header className="text-center">
        <Icons.logo className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          franky
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter a DevOps task below, and I'll generate a step-by-step
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
        {serverError && !isPending && (
           <Alert variant="destructive">
            <AlertTitle>Error Generating Guide</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        {!isPending && !serverError && guide && (
          <>
            <GuideDisplay guide={guide} />
            {errors && errors.length > 0 && (
              <div className="mt-6 text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      View Potential Errors
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Potential Errors & Solutions</DialogTitle>
                    </DialogHeader>
                    <Accordion type="single" collapsible className="w-full">
                       {errors.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger className="text-left text-base hover:no-underline">
                            {item.error}
                          </AccordionTrigger>
                          <AccordionContent>
                            <FormattedContent text={item.solution} />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </>
        )}
        {!isPending && !serverError && !guide && <WelcomePlaceholder />}
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Powered by Google Gemini. Built with Next.js and Firebase.</p>
      </footer>
    </main>
  );
}
