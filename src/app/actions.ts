'use server';

import { generateDevopsGuide } from '@/ai/flows/generate-devops-guide';
import { formatGuideTree } from '@/ai/flows/format-guide-tree';
import { z } from 'zod';

const requestSchema = z.string().min(10, 'Request must be at least 10 characters.');

export async function generateAndFormatGuide(request: string): Promise<{ guideTree: string | null; error: string | null }> {
  try {
    const validation = requestSchema.safeParse(request);
    if (!validation.success) {
      return { guideTree: null, error: validation.error.errors[0].message };
    }

    const { guide } = await generateDevopsGuide({ request });
    if (!guide) {
      return { guideTree: null, error: 'The AI failed to generate a guide. Please try a different request.' };
    }

    const { tree } = await formatGuideTree({ guide });
    if (!tree) {
      return { guideTree: null, error: 'The AI failed to format the guide into a tree structure.' };
    }

    return { guideTree: tree, error: null };
  } catch (error) {
    console.error('Error generating DevOps guide:', error);
    return { guideTree: null, error: 'An unexpected error occurred on the server. Please try again later.' };
  }
}
