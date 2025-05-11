// src/ai/flows/suggest-remedies.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting remedies or treatments for crop diseases.
 *
 * The flow takes a disease diagnosis as input and returns a list of suggested remedies.
 * @fileOverview Suggests remedies for a given plant disease.
 *
 * - suggestRemedies - A function that suggests remedies for a given plant disease.
 * - SuggestRemediesInput - The input type for the suggestRemedies function.
 * - SuggestRemediesOutput - The return type for the suggestRemedies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRemediesInputSchema = z.object({
  diseaseName: z.string().describe('The name of the diagnosed disease.'),
  cropType: z.string().describe('The type of crop affected by the disease.'),
  diagnosisDetails: z
    .string()
    .optional()
    .describe('Optional additional details about the diagnosis.'),
});
export type SuggestRemediesInput = z.infer<typeof SuggestRemediesInputSchema>;

const SuggestRemediesOutputSchema = z.object({
  remedies: z
    .array(z.string())
    .describe('A list of suggested remedies or treatments for the disease.'),
  confidence: z
    .number()
    .optional()
    .describe('A confidence score (0-1) indicating the reliability of the suggested remedies.'),
});
export type SuggestRemediesOutput = z.infer<typeof SuggestRemediesOutputSchema>;

export async function suggestRemedies(input: SuggestRemediesInput): Promise<SuggestRemediesOutput> {
  return suggestRemediesFlow(input);
}

const suggestRemediesPrompt = ai.definePrompt({
  name: 'suggestRemediesPrompt',
  input: {schema: SuggestRemediesInputSchema},
  output: {schema: SuggestRemediesOutputSchema},
  prompt: `You are an expert in plant pathology, providing advice to farmers on how to treat diseases.

  Given the following disease diagnosis, suggest potential remedies or treatments.

  Crop Type: {{{cropType}}}
  Disease Name: {{{diseaseName}}}
  Diagnosis Details: {{{diagnosisDetails}}}

  Provide a list of specific, actionable remedies that the farmer can take to address the disease. Focus on practical and easily implementable solutions.
  Include a confidence score (0-1) to show how sure you are of the remedies.

  Format your output as a JSON object matching the following schema:
  ${JSON.stringify(SuggestRemediesOutputSchema.shape, null, 2)}`,
});

const suggestRemediesFlow = ai.defineFlow(
  {
    name: 'suggestRemediesFlow',
    inputSchema: SuggestRemediesInputSchema,
    outputSchema: SuggestRemediesOutputSchema,
  },
  async input => {
    const {output} = await suggestRemediesPrompt(input);
    return output!;
  }
);
