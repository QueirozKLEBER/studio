import { config } from 'dotenv';
config();

import '@/ai/flows/generate-exercise-descriptions.ts';
import '@/ai/flows/suggest-workout-plans.ts';
import '@/ai/flows/mfit-assistant-flow.ts';
