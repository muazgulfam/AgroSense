'use server';
/**
 * @fileOverview A crop disease diagnosis AI agent.
 *
 * - diagnoseCropDisease - A function that handles the crop disease diagnosis process.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop in the image (e.g., Guava, Mango, Tomato, Cotton, Rice).'),
  symptoms: z.string().optional().describe('Optional: A description of the symptoms observed on the crop.'),
});
export type DiagnoseCropDiseaseInput = z.infer<typeof DiagnoseCropDiseaseInputSchema>;

const DiagnoseCropDiseaseOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseName: z.string().describe('The identified disease name.'),
    confidenceLevel: z.number().describe('The confidence level of the disease identification (0-1).'),
  }),
  recommendedActions: z.array(z.string()).describe('A list of recommended actions to treat the disease.'),
  additionalNotes: z.string().optional().describe('Any additional notes or observations.'),
});
export type DiagnoseCropDiseaseOutput = z.infer<typeof DiagnoseCropDiseaseOutputSchema>;

export async function diagnoseCropDisease(input: DiagnoseCropDiseaseInput): Promise<DiagnoseCropDiseaseOutput> {
  return diagnoseCropDiseaseFlow(input);
}

const diagnoseCropDiseasePrompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: {schema: DiagnoseCropDiseaseInputSchema},
  output: {schema: DiagnoseCropDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology, specializing in diagnosing diseases in crops such as Guava, Mango, Tomato, Cotton, and Rice.

  Analyze the provided image of the crop and any described symptoms to identify potential diseases.

  Provide a diagnosis with a confidence level and suggest appropriate actions for treatment.

  Crop Type: {{{cropType}}}
  Symptoms: {{{symptoms}}}
  Image: {{media url=photoDataUri}}
  \n  Based on the image and provided details, diagnose the crop disease and suggest treatment methods.
  `,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropDiseaseInputSchema,
    outputSchema: DiagnoseCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await diagnoseCropDiseasePrompt(input);
    return output!;
  }
);
