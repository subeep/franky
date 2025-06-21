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

const GenerateDevopsGuideOutputSchema = z.object({
  guide: z.string().describe('The generated step-by-step guide.'),
});
export type GenerateDevopsGuideOutput = z.infer<typeof GenerateDevopsGuideOutputSchema>;

export async function generateDevopsGuide(input: GenerateDevopsGuideInput): Promise<GenerateDevopsGuideOutput> {
  return generateDevopsGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDevopsGuidePrompt',
  input: {schema: GenerateDevopsGuideInputSchema},
  output: {schema: GenerateDevopsGuideOutputSchema},
  prompt: `You are an expert DevOps engineer. Generate a step-by-step guide for the following task:

{{{request}}}

Format the guide in a clear and concise manner. Each step should include actionable instructions.`,
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
