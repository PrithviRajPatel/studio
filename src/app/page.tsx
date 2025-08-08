import {
  CloudRain,
  Droplets,
  FlaskConical,
  Sun,
  Thermometer,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AlertsCard } from '@/components/agrimind/alerts-card';
import { FertilizerRecommendationCard } from '@/components/agrimind/fertilizer-recommendation-card';
import { Logo } from '@/components/agrimind/logo';
import { ManualControlCard } from '@/components/agrimind/manual-control-card';
import { SmartIrrigationCard } from '@/components/agrimind/smart-irrigation-card';
import { StatCard } from '@/components/agrimind/stat-card';
import { UserNav } from '@/components/agrimind/user-nav';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <Logo />
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Soil Moisture"
            value="45%"
            icon={Droplets}
            description="Optimal range: 50-70%"
          />
          <StatCard
            title="NPK Levels"
            value="12-8-10"
            icon={FlaskConical}
            description="Nitrogen-Phosphorus-Potassium"
          />
          <StatCard
            title="Temperature"
            value="26°C"
            icon={Thermometer}
            description="Ambient air temperature"
          />
          <StatCard
            title="Weather"
            value="Sunny"
            icon={Sun}
            description="Next 24h: chance of rain 10%"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI Decision Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="irrigation">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="irrigation">
                      Smart Irrigation
                    </TabsTrigger>
                    <TabsTrigger value="fertilizer">
                      Precision Fertilization
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="irrigation" className="mt-4">
                    <SmartIrrigationCard />
                  </TabsContent>
                  <TabsContent value="fertilizer" className="mt-4">
                    <FertilizerRecommendationCard />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <AlertsCard />
            <ManualControlCard />
          </div>
        </div>
      </main>
    </div>
  );
}
