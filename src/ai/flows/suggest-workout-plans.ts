'use server';

/**
 * @fileOverview A workout plan suggestion AI agent.
 *
 * - suggestWorkoutPlans - A function that suggests workout plans based on user input.
 * - SuggestWorkoutPlansInput - The input type for the suggestWorkoutPlans function.
 * - SuggestWorkoutPlansOutput - The return type for the suggestWorkoutPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkoutPlansInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user, e.g., weight loss, muscle gain, general fitness.'),
  experienceLevel: z
    .string()
    .describe('The experience level of the user, e.g., beginner, intermediate, advanced.'),
  availableEquipment: z
    .string()
    .describe(
      'The available equipment of the user, e.g., dumbbells, barbells, resistance bands, no equipment.'
    ),
});
export type SuggestWorkoutPlansInput = z.infer<typeof SuggestWorkoutPlansInputSchema>;

const SuggestWorkoutPlansOutputSchema = z.object({
  workoutPlans: z
    .array(z.string())
    .describe('A list of workout plans tailored to the user input.'),
});
export type SuggestWorkoutPlansOutput = z.infer<typeof SuggestWorkoutPlansOutputSchema>;

export async function suggestWorkoutPlans(input: SuggestWorkoutPlansInput): Promise<SuggestWorkoutPlansOutput> {
  return suggestWorkoutPlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkoutPlansPrompt',
  input: {schema: SuggestWorkoutPlansInputSchema},
  output: {schema: SuggestWorkoutPlansOutputSchema},
  prompt: `You are an expert personal trainer. Based on the user's fitness goals, experience level, and available equipment, suggest 3 workout plans.

Fitness Goals: {{{fitnessGoals}}}
Experience Level: {{{experienceLevel}}}
Available Equipment: {{{availableEquipment}}}

Workout Plans:`,
});

const suggestWorkoutPlansFlow = ai.defineFlow(
  {
    name: 'suggestWorkoutPlansFlow',
    inputSchema: SuggestWorkoutPlansInputSchema,
    outputSchema: SuggestWorkoutPlansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
