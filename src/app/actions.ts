'use server';

import { generateDevopsGuide, type GenerateDevopsGuideOutput } from '@/ai/flows/generate-devops-guide';
import { z } from 'zod';

const requestSchema = z.string().min(10, 'Request must be at least 10 characters.');

export async function generateGuide(request: string): Promise<{ guide: GenerateDevopsGuideOutput['guide'] | null; errors: GenerateDevopsGuideOutput['errors'] | null; error: string | null }> {
  try {
    const validation = requestSchema.safeParse(request);
    if (!validation.success) {
      return { guide: null, errors: null, error: validation.error.errors[0].message };
    }

    const result = await generateDevopsGuide({ request });
    if (!result || !result.guide) {
      return { guide: null, errors: null, error: 'The AI failed to generate a guide. Please try a different request.' };
    }

    return { guide: result.guide, errors: result.errors, error: null };
  } catch (error) {
    console.error('Error generating DevOps guide:', error);
    return { guide: null, errors: null, error: 'An unexpected error occurred on the server. Please try again later.' };
  }
}
