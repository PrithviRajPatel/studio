import {
  AlertTriangle,
  FlaskConical,
  Info,
  ThermometerSnowflake,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const alerts = [
  {
    icon: FlaskConical,
    title: 'Low Nitrogen Levels',
    description: 'Consider applying nitrogen-rich fertilizer.',
    variant: 'destructive',
  },
  {
    icon: ThermometerSnowflake,
    title: 'Frost Warning',
    description: 'Temperature expected to drop below 2°C tonight.',
    variant: 'default',
  },
  {
    icon: Info,
    title: 'Pump Maintenance Due',
    description: 'Scheduled maintenance for water pump in 3 days.',
    variant: 'default',
  },
];

export function AlertsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" />
          Critical Alerts
        </CardTitle>
        <CardDescription>Timely notifications for your farm.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${alert.variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}
            >
              <alert.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{alert.title}</p>
              <p className="text-sm text-muted-foreground">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
