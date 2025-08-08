'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  fertilizerRecommendation,
  type FertilizerRecommendationOutput,
} from '@/ai/flows/fertilizer-recommendation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  nitrogen: z.number().min(0).max(200),
  phosphorus: z.number().min(0).max(200),
  potassium: z.number().min(0).max(200),
  soilPh: z.number().min(0).max(14),
  cropType: z.string().min(1, 'Please select a crop type.'),
});

type FormData = z.infer<typeof formSchema>;

export function FertilizerRecommendationCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] =
    useState<FertilizerRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      soilPh: 6.5,
      cropType: 'corn',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);

    try {
      const recommendation = await fertilizerRecommendation({
        npkData: {
          nitrogen: values.nitrogen,
          phosphorus: values.phosphorus,
          potassium: values.potassium,
        },
        soilPh: values.soilPh,
        cropType: values.cropType,
      });
      setResult(recommendation);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get fertilizer recommendation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="nitrogen"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Nitrogen (N)</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value} kg/ha
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        max={200}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phosphorus"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Phosphorus (P)</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value} kg/ha
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        max={200}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="potassium"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Potassium (K)</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value} kg/ha
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        max={200}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="soilPh"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Soil pH</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value.toFixed(1)}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        max={14}
                        step={0.1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendation...
              </>
            ) : (
              'Get Recommendation'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div className="mt-6 space-y-4 rounded-md border border-dashed p-4">
          <h4 className="font-semibold text-lg">AI Recommendation</h4>
          <div>
            <Label>Recommendation</Label>
            <p className="text-sm">{result.recommendation}</p>
          </div>
          <div>
            <Label>Explanation</Label>
            <p className="text-sm text-muted-foreground">
              {result.explanation}
            </p>
          </div>
          <div>
            <Label>Confidence Score</Label>
            <div className="flex items-center gap-2">
              <Progress
                value={result.confidenceScore * 100}
                className="w-full"
              />
              <span className="text-sm font-medium">
                {(result.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
