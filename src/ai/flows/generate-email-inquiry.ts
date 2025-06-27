// src/ai/flows/generate-email-inquiry.ts
'use server';
/**
 * @fileOverview Generates a personalized email inquiry for a specific accommodation based on user preferences.
 *
 * - generateEmailInquiry - A function that generates the email inquiry.
 * - GenerateEmailInquiryInput - The input type for the generateEmailInquiry function.
 * - GenerateEmailInquiryOutput - The return type for the generateEmailInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailInquiryInputSchema = z.object({
  refinedPreferences_JSON_String: z.string().describe('The user\u2019s refined preferences in JSON string format.'),
  propertyName: z.string().describe('The name of the property.'),
  propertyType: z.string().describe('The type of the property (e.g., Serviced Apartment, Hotel).'),
  userPrimaryType: z.string().describe('The user\u2019s primary type (e.g., Student, Working Individual, Tourist).'),
  userSpecificType: z.string().describe('The user\u2019s specific type (e.g., Undergraduate, Full-time Employee, Short Stay).'),
});
export type GenerateEmailInquiryInput = z.infer<typeof GenerateEmailInquiryInputSchema>;

const GenerateEmailInquiryOutputSchema = z.object({
  emailBody: z.string().describe('The generated email body for the inquiry.'),
});
export type GenerateEmailInquiryOutput = z.infer<typeof GenerateEmailInquiryOutputSchema>;

export async function generateEmailInquiry(input: GenerateEmailInquiryInput): Promise<GenerateEmailInquiryOutput> {
  return generateEmailInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailInquiryPrompt',
  input: {schema: GenerateEmailInquiryInputSchema},
  output: {schema: GenerateEmailInquiryOutputSchema},
  prompt: `Generate a polite, professional email body for a user inquiring about accommodation availability. The user's preferences are: {{{refinedPreferences_JSON_String}}}. The property they are inquiring about is named '{{propertyName}}' and is a '{{propertyType}}'. The user is a '{{userPrimaryType}}' (specifically a '{{userSpecificType}}'). Include details about their dates (moving in date for students/workers, inbound/outbound for tourists), number of people, budget range, and a specific reason for their interest in *this* property based on their refined preferences.`,
});

const generateEmailInquiryFlow = ai.defineFlow(
  {
    name: 'generateEmailInquiryFlow',
    inputSchema: GenerateEmailInquiryInputSchema,
    outputSchema: GenerateEmailInquiryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
