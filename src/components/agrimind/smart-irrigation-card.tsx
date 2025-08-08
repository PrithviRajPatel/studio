'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';

import {
  smartIrrigation,
  type SmartIrrigationOutput,
} from '@/ai/flows/smart-irrigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

const formSchema = z.object({
  soilMoisture: z.number().min(0).max(100),
  weatherForecast: z.string().min(1, 'Weather forecast is required.'),
  cropType: z.string().min(1, 'Crop type is required.'),
  previousIrrigation: z.date({
    required_error: 'Last irrigation date is required.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export function SmartIrrigationCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartIrrigationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilMoisture: 45,
      weatherForecast: 'Sunny, 10% chance of rain in the next 24 hours.',
      cropType: 'corn',
      previousIrrigation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);

    try {
      const recommendation = await smartIrrigation({
        ...values,
        previousIrrigation: values.previousIrrigation.toISOString(),
      });
      setResult(recommendation);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get irrigation recommendation.',
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="soilMoisture"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Soil Moisture</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value}%
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        max={100}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherForecast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Forecast</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sunny with a chance of rain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
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
              <FormField
                control={form.control}
                name="previousIrrigation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Irrigation Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                Analyzing Data...
              </>
            ) : (
              'Get Irrigation Advice'
            )}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 space-y-4 rounded-md border border-dashed p-4">
          <h4 className="font-semibold text-lg">AI Recommendation</h4>
          <div>
            <Label>Decision</Label>
            <p className={cn("text-lg font-bold", result.irrigationNeeded ? "text-primary" : "text-destructive")}>
              {result.irrigationNeeded ? `Irrigate for ${result.irrigationDuration} minutes.` : "No Irrigation Needed."}
            </p>
          </div>
          <div>
            <Label>Reason</Label>
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
