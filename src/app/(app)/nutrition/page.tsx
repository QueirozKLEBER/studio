'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { nutritionTips } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/page-header';
import { Sparkles, Utensils, Zap, Flame, Heart } from 'lucide-react';

export default function NutritionPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dicas Alimentares"
        subtitle="Potencialize seus resultados com uma nutrição inteligente. Lembre-se: consulte sempre um nutricionista."
      />

      <Tabs defaultValue="emagrecimento" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted rounded-2xl gap-1">
          <TabsTrigger value="emagrecimento" className="rounded-xl font-bold py-2 data-[state=active]:bg-white">
            <Flame className="h-4 w-4 mr-2 hidden sm:block" />
            Emagrecer
          </TabsTrigger>
          <TabsTrigger value="hipertrofia" className="rounded-xl font-bold py-2 data-[state=active]:bg-white">
            <Zap className="h-4 w-4 mr-2 hidden sm:block" />
            Hipertrofia
          </TabsTrigger>
          <TabsTrigger value="energia" className="rounded-xl font-bold py-2 data-[state=active]:bg-white">
            <Sparkles className="h-4 w-4 mr-2 hidden sm:block" />
            Energia
          </TabsTrigger>
          <TabsTrigger value="pre-treino" className="rounded-xl font-bold py-2 data-[state=active]:bg-white">
            <Utensils className="h-4 w-4 mr-2 hidden sm:block" />
            Pré
          </TabsTrigger>
          <TabsTrigger value="pos-treino" className="rounded-xl font-bold py-2 data-[state=active]:bg-white">
            <Heart className="h-4 w-4 mr-2 hidden sm:block" />
            Pós
          </TabsTrigger>
        </TabsList>

        {Object.entries(nutritionTips).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.tips.map((tip, index) => (
                <Card key={index} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-blue-50/30">
                    <CardTitle className="font-bold text-lg text-primary flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {category.tips.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground italic">
                  Novas dicas sendo preparadas pelo nosso time...
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}