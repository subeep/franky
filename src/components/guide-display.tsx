'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface GuideDisplayProps {
  tree: string;
  completedSteps: Set<string>;
  onStepToggle: (stepId: string) => void;
}

type Step = {
  id: string;
  text: string;
  level: number;
};

export function GuideDisplay({ tree, completedSteps, onStepToggle }: GuideDisplayProps) {
  const steps = React.useMemo(() => {
    if (!tree) return [];
    return tree
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line, index) => {
        const text = line.trim();
        const indentation = line.length - line.trimStart().length;
        const level = Math.floor(indentation / 2); // Assuming 2 spaces for indentation
        return { id: `${index}-${text}`, text, level };
      });
  }, [tree]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold font-headline text-primary">Your Step-by-Step Guide</h2>
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-start transition-colors duration-200 rounded-md p-2 hover:bg-muted/50"
          style={{ paddingLeft: `${step.level * 2 + 0.5}rem` }}
        >
          <Checkbox
            id={step.id}
            checked={completedSteps.has(step.id)}
            onCheckedChange={() => onStepToggle(step.id)}
            className="mt-1 border-accent"
            aria-label={`Mark step as complete: ${step.text}`}
          />
          <label
            htmlFor={step.id}
            className={cn(
              'ml-3 text-base cursor-pointer',
              completedSteps.has(step.id)
                ? 'line-through text-muted-foreground'
                : 'text-foreground'
            )}
          >
            {step.text}
          </label>
        </div>
      ))}
    </div>
  );
}
