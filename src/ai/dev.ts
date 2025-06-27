import { config } from 'dotenv';
config();

import '@/ai/flows/generate-accommodation-suggestions.ts';
import '@/ai/flows/generate-amenities-prompt.ts';
import '@/ai/flows/generate-style-needs-prompt.ts';
import '@/ai/flows/generate-email-inquiry.ts';
import '@/ai/flows/generate-location-prompt.ts';