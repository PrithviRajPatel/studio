'use server';

/**
 * @fileOverview AI-driven Irrigation Tool.
 *
 * - smartIrrigation - A function that handles the smart irrigation process.
 * - SmartIrrigationInput - The input type for the smartIrrigation function.
 * - SmartIrrigationOutput - The return type for the smartIrrigation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartIrrigationInputSchema = z.object({
  soilMoisture: z.number().describe('Current soil moisture level (percentage).'),
  weatherForecast: z.string().describe('Weather forecast for the next 24 hours.'),
  cropType: z.string().describe('Type of crop being irrigated.'),
  previousIrrigation: z
    .string()
    .describe('Date of the most recent irrigation, in ISO format. e.g. 2024-04-23T14:00:00.000Z'),
});

export type SmartIrrigationInput = z.infer<typeof SmartIrrigationInputSchema>;

const SmartIrrigationOutputSchema = z.object({
  irrigationNeeded: z.boolean().describe('Whether irrigation is needed.'),
  irrigationDuration: z
    .number()
    .describe('Recommended irrigation duration in minutes.  If irrigation is not needed, this should be 0.'),
  reason: z.string().describe('The reason for the irrigation recommendation.'),
});

export type SmartIrrigationOutput = z.infer<typeof SmartIrrigationOutputSchema>;

export async function smartIrrigation(input: SmartIrrigationInput): Promise<SmartIrrigationOutput> {
  return smartIrrigationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartIrrigationPrompt',
  input: {schema: SmartIrrigationInputSchema},
  output: {schema: SmartIrrigationOutputSchema},
  prompt: `You are an expert in agricultural irrigation.  You will analyze the soil moisture, weather forecast, crop type, and last irrigation date to determine an optimal irrigation schedule. You MUST take into account weather forecast information to avoid watering when it's about to rain.

Soil Moisture: {{soilMoisture}}%
Weather Forecast: {{weatherForecast}}
Crop Type: {{cropType}}
Last Irrigation: {{previousIrrigation}}

Based on this information, determine if irrigation is needed and for how long.  Return irrigationDuration of 0 if irrigation is not needed.

Consider that the last irrigation happened on {{previousIrrigation}}, has the soil had enough time to dry to require more irrigation?  If the soil has recently been irrigated, there is a strong chance that irrigationDuration should be 0.

Return a reason for your recommendation.
`,
});

const smartIrrigationFlow = ai.defineFlow(
  {
    name: 'smartIrrigationFlow',
    inputSchema: SmartIrrigationInputSchema,
    outputSchema: SmartIrrigationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

