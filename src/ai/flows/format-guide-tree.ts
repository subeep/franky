'use server';

/**
 * @fileOverview Formats a DevOps guide into a tree-like structure.
 *
 * - formatGuideTree - A function that formats the guide into a tree structure.
 * - FormatGuideTreeInput - The input type for the formatGuideTree function.
 * - FormatGuideTreeOutput - The return type for the formatGuideTree function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatGuideTreeInputSchema = z.object({
  guide: z.string().describe('The DevOps guide to format.'),
});
export type FormatGuideTreeInput = z.infer<typeof FormatGuideTreeInputSchema>;

const FormatGuideTreeOutputSchema = z.object({
  tree: z.string().describe('The formatted tree-like structure of the guide.'),
});
export type FormatGuideTreeOutput = z.infer<typeof FormatGuideTreeOutputSchema>;

export async function formatGuideTree(input: FormatGuideTreeInput): Promise<FormatGuideTreeOutput> {
  return formatGuideTreeFlow(input);
}

const formatGuideTreePrompt = ai.definePrompt({
  name: 'formatGuideTreePrompt',
  input: {schema: FormatGuideTreeInputSchema},
  output: {schema: FormatGuideTreeOutputSchema},
  prompt: `You are a DevOps expert. Take the following guide and format it as a tree, using indentation to show the hierarchy.

Guide:
{{{guide}}}`,
});

const formatGuideTreeFlow = ai.defineFlow(
  {
    name: 'formatGuideTreeFlow',
    inputSchema: FormatGuideTreeInputSchema,
    outputSchema: FormatGuideTreeOutputSchema,
  },
  async input => {
    const {output} = await formatGuideTreePrompt(input);
    return output!;
  }
);
