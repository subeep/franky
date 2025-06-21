'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const Breadcrumb = ({ path }: { path: string }) => {
  const parts = path.split('>').map(p => p.trim());
  return (
    <div className="my-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border bg-muted p-3 text-sm">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
          <span className="text-muted-foreground">{part}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

const FormattedDetails = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|```[^`]+```)/g);
  return (
    <div className="whitespace-pre-wrap text-base leading-relaxed text-card-foreground/90">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return (
            <pre key={i} className="my-3 rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-200 overflow-x-auto">
              <code>{part.slice(3, -3).trim()}</code>
            </pre>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="mx-0.5 rounded-sm bg-gray-700/50 px-1.5 py-1 font-mono text-sm">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            const textInside = part.slice(2, -2);
            if (textInside.includes('>') && textInside.split('>').length > 1) {
                return <Breadcrumb key={i} path={textInside} />;
            }
            return <strong key={i} className="font-semibold text-card-foreground">{textInside}</strong>
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
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
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold font-headline text-primary">Your Step-by-Step Guide</h2>
      <Accordion type="single" collapsible className="w-full">
        {guide.map((item, index) => {
          const isCompleted = completedSteps.includes(index);
          return (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger 
                className={cn(
                  "text-left text-lg hover:no-underline",
                  isCompleted && "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <Checkbox
                    id={`step-${index}`}
                    checked={isCompleted}
                    onCheckedChange={() => toggleStep(index)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded-md"
                  />
                  <span className={cn(
                      "flex-1 text-left",
                      isCompleted && "line-through"
                  )}>
                    {index + 1}. {item.step}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-9">
                <FormattedDetails text={item.details} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
