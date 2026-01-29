'use server';

/**
 * @fileOverview An AI agent to generate exercise descriptions and tips for trainers.
 *
 * - generateExerciseDescriptions - A function that generates exercise descriptions and tips.
 * - GenerateExerciseDescriptionsInput - The input type for the generateExerciseDescriptions function.
 * - GenerateExerciseDescriptionsOutput - The return type for the generateExerciseDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExerciseDescriptionsInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise.'),
  muscleGroup: z.string().describe('The muscle group the exercise targets.'),
  equipment: z.string().optional().describe('Any equipment required for the exercise.'),
});

export type GenerateExerciseDescriptionsInput = z.infer<typeof GenerateExerciseDescriptionsInputSchema>;

const GenerateExerciseDescriptionsOutputSchema = z.object({
  description: z.string().describe('A detailed description of the exercise.'),
  executionTips: z.string().describe('Tips for proper execution and posture.'),
});

export type GenerateExerciseDescriptionsOutput = z.infer<typeof GenerateExerciseDescriptionsOutputSchema>;

export async function generateExerciseDescriptions(
  input: GenerateExerciseDescriptionsInput
): Promise<GenerateExerciseDescriptionsOutput> {
  return generateExerciseDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExerciseDescriptionsPrompt',
  input: {schema: GenerateExerciseDescriptionsInputSchema},
  output: {schema: GenerateExerciseDescriptionsOutputSchema},
  prompt: `You are an expert personal trainer. Generate a detailed description and execution tips for the following exercise:

Exercise Name: {{{exerciseName}}}
Muscle Group: {{{muscleGroup}}}
Equipment: {{{equipment}}}

Description:
Execution Tips:`, // Added equipment in the prompt
});

const generateExerciseDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateExerciseDescriptionsFlow',
    inputSchema: GenerateExerciseDescriptionsInputSchema,
    outputSchema: GenerateExerciseDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
