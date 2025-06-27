'use server';
/**
 * @fileOverview A flow to generate an image for an accommodation.
 *
 * - generateAccommodationImage - A function that handles the image generation.
 * - GenerateAccommodationImageInput - The input type for the function.
 * - GenerateAccommodationImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateAccommodationImageInputSchema = z.object({
  name: z.string().describe('The name of the accommodation.'),
  type: z.string().describe('The type of accommodation (e.g., Serviced Apartment, Hotel).'),
  description: z.string().describe('A short description of the accommodation style and features.'),
});
export type GenerateAccommodationImageInput = z.infer<typeof GenerateAccommodationImageInputSchema>;

export const GenerateAccommodationImageOutputSchema = z.object({
    imageUrl: z.string().describe('A data URI for the generated image.')
});
export type GenerateAccommodationImageOutput = z.infer<typeof GenerateAccommodationImageOutputSchema>;


export async function generateAccommodationImage(input: GenerateAccommodationImageInput): Promise<GenerateAccommodationImageOutput> {
  return generateAccommodationImageFlow(input);
}

const generateAccommodationImageFlow = ai.defineFlow(
  {
    name: 'generateAccommodationImageFlow',
    inputSchema: GenerateAccommodationImageInputSchema,
    outputSchema: GenerateAccommodationImageOutputSchema,
  },
  async (input) => {
    const prompt = `A high-quality, photorealistic image of the interior of a ${input.type} called "${input.name}". It is described as: ${input.description}. The image should not contain any text or people.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error("Image generation failed.");
    }
    
    return { imageUrl: media.url };
  }
);
