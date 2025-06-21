'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FormattedDetails = ({ text }: { text: string }) => {
  const parts = text.split(/(`[^`]+`|```[^`]+```)/g);
  return (
    <p className="whitespace-pre-wrap text-base leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return (
            <pre key={i} className="my-2 rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
              <code>{part.slice(3, -3).trim()}</code>
            </pre>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="mx-1 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
};


interface GuideStep {
  step: string;
  details: string;
}

interface GuideDisplayProps {
  guide: GuideStep[];
}

export function GuideDisplay({ guide }: GuideDisplayProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold font-headline text-primary">Your Step-by-Step Guide</h2>
      <Accordion type="single" collapsible className="w-full">
        {guide.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left text-lg hover:no-underline">
              {index + 1}. {item.step}
            </AccordionTrigger>
            <AccordionContent>
              <FormattedDetails text={item.details} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
