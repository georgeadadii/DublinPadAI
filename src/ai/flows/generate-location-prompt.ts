'use server';

/**
 * @fileOverview A Genkit flow for generating dynamic prompts to refine location and vibe preferences.
 *
 * This file exports:
 * - `generateLocationPrompt`: The function to generate the dynamic prompt.
 * - `GenerateLocationPromptInput`: The input type for the `generateLocationPrompt` function.
 * - `GenerateLocationPromptOutput`: The output type for the `generateLocationPrompt` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationPromptInputSchema = z.object({
  userPrimaryType: z.string().describe('The primary user type (Student, Working Individual, or Tourist).'),
  userSpecificType: z.string().describe('The specific user type (e.g., Undergraduate, Full-time Employee, Short Stay).'),
  inboundDate: z.string().optional().describe('The arrival date (if Tourist).'),
  outboundDate: z.string().optional().describe('The departure date (if Tourist).'),
  movingInDate: z.string().optional().describe('The move-in date (if Student or Working Individual).'),
  adults: z.number().describe('The number of adults staying.'),
  children: z.number().describe('The number of children staying.'),
  minBudget: z.number().describe('The minimum budget.'),
  maxBudget: z.number().describe('The maximum budget.'),
  budgetUnit: z.string().describe('The budget unit (per_night or per_month).'),
  initialFreeformQuery: z.string().optional().describe('The user-provided initial query.'),
});

export type GenerateLocationPromptInput = z.infer<typeof GenerateLocationPromptInputSchema>;

const GenerateLocationPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated dynamic prompt for location and vibe preferences.'),
});

export type GenerateLocationPromptOutput = z.infer<typeof GenerateLocationPromptOutputSchema>;

export async function generateLocationPrompt(input: GenerateLocationPromptInput): Promise<GenerateLocationPromptOutput> {
  return generateLocationPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocationPromptPrompt',
  input: {schema: GenerateLocationPromptInputSchema},
  output: {schema: GenerateLocationPromptOutputSchema},
  prompt: `Based on the user's initial input (User Type: {{{userPrimaryType}}} - {{{userSpecificType}}}, Dates: {{#if inboundDate}}{{{inboundDate}}} to {{{outboundDate}}}{{else}}Moving In: {{{movingInDate}}}{{/if}}, Adults: {{{adults}}}, Children: {{{children}}}, Budget Range: €{{{minBudget}}}-€{{{maxBudget}}} per {{{budgetUnit}}}, Initial Query: '{{{initialFreeformQuery}}}'), generate a concise, conversational question to help them refine their location and neighborhood preferences in Dublin. Emphasize options relevant to their user type and specific situation.`, 
});

const generateLocationPromptFlow = ai.defineFlow(
  {
    name: 'generateLocationPromptFlow',
    inputSchema: GenerateLocationPromptInputSchema,
    outputSchema: GenerateLocationPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
