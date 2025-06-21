'use server';
/**
 * @fileOverview A DevOps guide generation AI agent.
 *
 * - generateDevopsGuide - A function that handles the generation of DevOps guides.
 * - GenerateDevopsGuideInput - The input type for the generateDevopsGuide function.
 * - GenerateDevopsGuideOutput - The return type for the generateDevopsGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDevopsGuideInputSchema = z.object({
  request: z.string().describe('The DevOps task request (e.g., Deploy a Docker container to Google Cloud).'),
});
export type GenerateDevopsGuideInput = z.infer<typeof GenerateDevopsGuideInputSchema>;

const GuideStepSchema = z.object({
  step: z.string().describe('A single, actionable step in the guide. This should be a concise summary of the task.'),
  details: z.string().describe('A detailed explanation of the step, including commands and code snippets if necessary. Format code snippets in markdown.'),
});

const PotentialErrorSchema = z.object({
  error: z.string().describe('A potential error or issue that could occur during the process.'),
  solution: z.string().describe('The solution or troubleshooting steps for the error. Format code snippets in markdown.'),
});

const GenerateDevopsGuideOutputSchema = z.object({
  guide: z.array(GuideStepSchema).describe('The array of step-by-step instructions. Only include workable, actionable steps.'),
  errors: z.array(PotentialErrorSchema).describe('A list of potential errors and their solutions for the entire process.'),
});
export type GenerateDevopsGuideOutput = z.infer<typeof GenerateDevopsGuideOutputSchema>;

export async function generateDevopsGuide(input: GenerateDevopsGuideInput): Promise<GenerateDevopsGuideOutput> {
  return generateDevopsGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDevopsGuidePrompt',
  input: {schema: GenerateDevopsGuideInputSchema},
  output: {schema: GenerateDevopsGuideOutputSchema},
  prompt: `You are an expert DevOps engineer named Franky. A user has requested a guide for a task.

Task: {{{request}}}

Generate a step-by-step guide for the task. The guide should consist of only workable, actionable steps. For each step, provide a concise summary (the 'step') and a detailed explanation ('details').

Also, provide a list of potential errors the user might encounter during the entire process, along with their solutions.

Format the output as a JSON object with two keys: 'guide' and 'errors'.
- 'guide' should be an array of objects, where each object has 'step' and 'details' keys.
- 'errors' should be an array of objects, where each object has 'error' and 'solution' keys.`,
});

const generateDevopsGuideFlow = ai.defineFlow(
  {
    name: 'generateDevopsGuideFlow',
    inputSchema: GenerateDevopsGuideInputSchema,
    outputSchema: GenerateDevopsGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
