'use server';

/**
 * @fileOverview A flow to generate personalized accommodation suggestions based on refined preferences.
 *
 * - generateAccommodationSuggestions - A function that handles the generation of accommodation suggestions.
 * - GenerateAccommodationSuggestionsInput - The input type for the generateAccommodationSuggestions function.
 * - GenerateAccommodationSuggestionsOutput - The return type for the generateAccommodationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAccommodationSuggestionsInputSchema = z.object({
  refinedPreferences_JSON_String: z.string().describe('A JSON string containing the user\u0027s refined preferences for accommodation.'),
});
export type GenerateAccommodationSuggestionsInput = z.infer<typeof GenerateAccommodationSuggestionsInputSchema>;

const AccommodationSuggestionSchema = z.object({
  name: z.string().describe('The name of the accommodation.'),
  type: z.string().describe('The type of accommodation (e.g., Serviced Apartment, Hotel).'),
  keyFeatures: z.array(z.string()).describe('A list of key features of the accommodation.'),
  estimatedPriceRange: z.string().describe('The estimated price range per night or month.'),
  locationSnapshot: z.string().describe('A short description of the location.'),
  whyThisSuggestion: z.string().describe('An explanation of why this suggestion fits the user\u0027s needs.'),
  imageUrl: z.string().describe('A direct URL to a high-quality, real image of the property found on the web.'),
  mapCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .describe('Latitude and longitude for pinpointing the accommodation on a map.'),
  contactInfo:
    z
      .object({
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional()
      .describe('Optional contact information for the accommodation.'),
  id: z.string().describe('A unique identifier to link to mock accommodation data.'),
});

const GenerateAccommodationSuggestionsOutputSchema = z.array(AccommodationSuggestionSchema).describe("A JSON array of suggested accommodations, including real image URLs and map coordinates.");
export type GenerateAccommodationSuggestionsOutput = z.infer<typeof GenerateAccommodationSuggestionsOutputSchema>;

export async function generateAccommodationSuggestions(input: GenerateAccommodationSuggestionsInput): Promise<GenerateAccommodationSuggestionsOutput> {
  return generateAccommodationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAccommodationSuggestionsPrompt',
  input: {schema: GenerateAccommodationSuggestionsInputSchema},
  output: {schema: GenerateAccommodationSuggestionsOutputSchema},
  prompt: `Given these detailed preferences for accommodation in Dublin: {{{refinedPreferences_JSON_String}}}. Search the internet for 3-5 unique, current, and highly suitable accommodation options in Dublin that match these criteria. For each option, provide: 'name', 'type', 'keyFeatures' (bullet points), 'estimatedPriceRange' (with unit per night/month), 'locationSnapshot', 'whyThisSuggestion' (a concise explanation of why it fits the user's needs), 'imageUrl' (a direct URL to a high-quality, real image of the property found on the web), 'mapCoordinates' (latitude and longitude as an object {lat: number, lng: number} for pinpointing on a map), and 'contactInfo' (email and phone number if publicly available). Prioritize options with real-time availability information if possible from your search. Format the output as a JSON array of objects. The id field in the JSON output should be a unique identifier.

`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateAccommodationSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateAccommodationSuggestionsFlow',
    inputSchema: GenerateAccommodationSuggestionsInputSchema,
    outputSchema: GenerateAccommodationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
