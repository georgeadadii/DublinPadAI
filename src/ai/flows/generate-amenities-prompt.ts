// src/ai/flows/generate-amenities-prompt.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dynamic prompts to refine user preferences for essential amenities in accommodation.
 *
 * The flow takes user type as input and returns a tailored prompt for amenities preferences.
 * - generateAmenitiesPrompt - A function that handles the prompt generation process.
 * - GenerateAmenitiesPromptInput - The input type for the generateAmenitiesPrompt function.
 * - GenerateAmenitiesPromptOutput - The return type for the generateAmenitiesPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAmenitiesPromptInputSchema = z.object({
  userPrimaryType: z
    .string()
    .describe(
      'The primary user type (student, working individual, or tourist)'
    ),
  userSpecificType: z.string().describe('The specific user type'),
});
export type GenerateAmenitiesPromptInput = z.infer<typeof GenerateAmenitiesPromptInputSchema>;

const GenerateAmenitiesPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt for amenities preferences.'),
});
export type GenerateAmenitiesPromptOutput = z.infer<typeof GenerateAmenitiesPromptOutputSchema>;

export async function generateAmenitiesPrompt(
  input: GenerateAmenitiesPromptInput
): Promise<GenerateAmenitiesPromptOutput> {
  return generateAmenitiesPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAmenitiesPromptPrompt',
  input: {schema: GenerateAmenitiesPromptInputSchema},
  output: {schema: GenerateAmenitiesPromptOutputSchema},
  prompt: `Based on the user type {{userPrimaryType}} (specifically {{userSpecificType}}), generate a concise, conversational question to help them refine their essential amenities preferences for accommodation. The prompt should be tailored to their user type. Examples:

- For a Working Professional: "To ensure a comfortable and productive stay, which amenities are most crucial for you? Think about work-related facilities, personal comfort, and convenience."
- For a Student: "For your student accommodation, which amenities are essential to make your living situation easy and enjoyable? Consider things like study space, communal areas, or laundry facilities."
- For a Tourist: "Now, let's talk about the features that will make your stay truly comfortable as a tourist. Please select all that apply, keeping in mind your short or longer visit."

Ensure the prompt is engaging and helps the user think about their needs. The output should be a single question.`,
});

const generateAmenitiesPromptFlow = ai.defineFlow(
  {
    name: 'generateAmenitiesPromptFlow',
    inputSchema: GenerateAmenitiesPromptInputSchema,
    outputSchema: GenerateAmenitiesPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
