'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Power } from 'lucide-react';

export function ManualControlCard() {
  const [isPumpOn, setIsPumpOn] = useState(false);
  const { toast } = useToast();

  const handlePumpToggle = (checked: boolean) => {
    setIsPumpOn(checked);
    toast({
      title: `Water pump turned ${checked ? 'ON' : 'OFF'}`,
      description: 'Manual override activated successfully.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5 text-primary" />
          Manual Control
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="water-pump" className="font-medium">
            Water Pump
          </Label>
          <Switch
            id="water-pump"
            checked={isPumpOn}
            onCheckedChange={handlePumpToggle}
            aria-label="Toggle Water Pump"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Override AI automation and control equipment directly.
        </p>
      </CardContent>
    </Card>
  );
}
