'use server';

/**
 * @fileOverview AI-driven fertilizer recommendation flow.
 *
 * - fertilizerRecommendation - A function that provides fertilizer recommendations based on sensor data and crop requirements.
 * - FertilizerRecommendationInput - The input type for the fertilizerRecommendation function.
 * - FertilizerRecommendationOutput - The return type for the fertilizerRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerRecommendationInputSchema = z.object({
  npkData: z
    .object({
      nitrogen: z.number().describe('Nitrogen level in the soil.'),
      phosphorus: z.number().describe('Phosphorus level in the soil.'),
      potassium: z.number().describe('Potassium level in the soil.'),
    })
    .describe('Real-time NPK sensor data.'),
  cropType: z.string().describe('The type of crop being grown.'),
  soilPh: z.number().describe('The pH of the soil.'),
  historicalYield: z
    .number()
    .optional()
    .describe('The historical yield of the crop in the area.'),
  weatherConditions: z
    .string()
    .optional()
    .describe('The current weather conditions.'),
});
export type FertilizerRecommendationInput = z.infer<
  typeof FertilizerRecommendationInputSchema
>;

const FertilizerRecommendationOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A fertilizer recommendation based on the NPK data, crop type, and other relevant factors.'
    ),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why the recommendation was made, including which factors were most important.'
    ),
  confidenceScore: z
    .number()
    .describe(
      'A score (0-1) indicating the confidence level in the recommendation.'
    ),
});
export type FertilizerRecommendationOutput = z.infer<
  typeof FertilizerRecommendationOutputSchema
>;

export async function fertilizerRecommendation(
  input: FertilizerRecommendationInput
): Promise<FertilizerRecommendationOutput> {
  return fertilizerRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerRecommendationPrompt',
  input: {schema: FertilizerRecommendationInputSchema},
  output: {schema: FertilizerRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following soil conditions, crop type, and weather conditions, provide a fertilizer recommendation.  Explain your reasoning and provide a confidence score (0-1) for your recommendation.\n\nSoil NPK Data: Nitrogen={{{npkData.nitrogen}}}, Phosphorus={{{npkData.phosphorus}}}, Potassium={{{npkData.potassium}}}\nCrop Type: {{{cropType}}}\nSoil pH: {{{soilPh}}}\nHistorical Yield: {{{historicalYield}}}\nWeather Conditions: {{{weatherConditions}}}\n\nRecommendation:`,
});

const fertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'fertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
