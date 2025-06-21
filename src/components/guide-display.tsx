'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import * as AccordionPrimitive from "@radix-ui/react-accordion"
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
    <div className="text-base leading-relaxed text-card-foreground/90">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return (
            <div key={i} className="my-4 rounded-lg bg-gray-950 shadow-lg">
              <div className="flex items-center gap-1.5 rounded-t-lg bg-gray-800 px-4 py-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-sm text-gray-200">
                <code>{part.slice(3, -3).trim()}</code>
              </pre>
            </div>
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
        return (
          <span key={i} className="whitespace-pre-wrap">
            {part.split(/(\n- .*)/g).filter(Boolean).map((textChunk, j) => {
              if (textChunk.startsWith('\n- ')) {
                return (
                  <div key={`${i}-${j}`} className="flex items-start py-1">
                    <span className="mr-3 mt-2 text-lg leading-none text-primary">•</span>
                    <span className="flex-1">{textChunk.substring(3)}</span>
                  </div>
                )
              }
              return <span key={`${i}-${j}`}>{textChunk}</span>;
            })}
          </span>
        );
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
              <AccordionPrimitive.Header className="flex w-full items-center">
                <div className="py-4 pl-4">
                  <Checkbox
                    id={`step-${index}`}
                    checked={isCompleted}
                    onCheckedChange={() => toggleStep(index)}
                    className="h-5 w-5 rounded-md"
                  />
                </div>
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between py-4 pr-4 font-medium transition-all hover:no-underline [&[data-state=open]>svg]:rotate-180",
                  )}
                >
                  <span className={cn(
                      "flex-1 text-left text-lg pl-2",
                      isCompleted ? "text-muted-foreground line-through" : ""
                  )}>
                    {index + 1}. {item.step}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="pl-16">
                <FormattedDetails text={item.details} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}