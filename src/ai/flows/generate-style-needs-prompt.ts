// src/ai/flows/generate-style-needs-prompt.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating dynamic prompts related to accommodation style and special needs.
 *
 * The flow takes user preferences as input and returns a tailored prompt to refine the search based on style and specific requirements.
 * - generateStyleNeedsPrompt - A function that handles the prompt generation process.
 * - GenerateStyleNeedsPromptInput - The input type for the generateStyleNeedsPrompt function.
 * - GenerateStyleNeedsPromptOutput - The return type for the generateStyleNeedsPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStyleNeedsPromptInputSchema = z.object({
  userPrimaryType: z.string().describe('The primary user type (e.g., Student, Working Individual, Tourist).'),
  userSpecificType: z.string().describe('The specific user type (e.g., Undergraduate, Full-time Employee, Short Stay).'),
  inboundDate: z.string().optional().describe('The inbound date for tourists (YYYY-MM-DD).'),
  outboundDate: z.string().optional().describe('The outbound date for tourists (YYYY-MM-DD).'),
  movingInDate: z.string().optional().describe('The moving in date for students/workers (YYYY-MM-DD).'),
  adults: z.number().describe('The number of adults.'),
  children: z.number().describe('The number of children.'),
  minBudget: z.number().describe('The minimum budget.'),
  maxBudget: z.number().describe('The maximum budget.'),
  budgetUnit: z.string().describe('The budget unit (e.g., per_night, per_month).'),
  initialFreeformQuery: z.string().describe('The initial freeform query from the user.'),
});

export type GenerateStyleNeedsPromptInput = z.infer<typeof GenerateStyleNeedsPromptInputSchema>;

const GenerateStyleNeedsPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt for refining style and special needs preferences.'),
});

export type GenerateStyleNeedsPromptOutput = z.infer<typeof GenerateStyleNeedsPromptOutputSchema>;

export async function generateStyleNeedsPrompt(input: GenerateStyleNeedsPromptInput): Promise<GenerateStyleNeedsPromptOutput> {
  return generateStyleNeedsPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStyleNeedsPrompt',
  input: {schema: GenerateStyleNeedsPromptInputSchema},
  output: {schema: GenerateStyleNeedsPromptOutputSchema},
  prompt: `Based on the user's initial input (User Type: {{{userPrimaryType}}} - {{{userSpecificType}}}, Dates: {{{inboundDate}}} to {{{outboundDate}}} [or Moving In: {{{movingInDate}}}], Adults: {{{adults}}}, Children: {{{children}}}, Budget Range: €{{{minBudget}}}-€{{{maxBudget}}} per {{{budgetUnit}}}, Initial Query: '{{{initialFreeformQuery}}}'), generate a concise, conversational question to help them refine their accommodation style preferences and any special needs they might have. Emphasize options relevant to their user type and specific situation. Consider aspects like desired aesthetic, noise level preferences, view preferences, and any specific local amenities they might be interested in. Provide example amenities tailored to the user type in the prompt.`,
});

const generateStyleNeedsPromptFlow = ai.defineFlow(
  {
    name: 'generateStyleNeedsPromptFlow',
    inputSchema: GenerateStyleNeedsPromptInputSchema,
    outputSchema: GenerateStyleNeedsPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
