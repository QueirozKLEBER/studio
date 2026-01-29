import {
  Card,
  CardContent,
  CardDescription,
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

export default function NutritionPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dicas Alimentares"
        subtitle="Potencialize seus resultados com uma nutrição inteligente. (Lembre-se, estas são dicas e não substituem um nutricionista)."
      />

      <Tabs defaultValue="emagrecimento" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="emagrecimento">Emagrecimento</TabsTrigger>
          <TabsTrigger value="hipertrofia">Hipertrofia</TabsTrigger>
          <TabsTrigger value="energia">Energia</TabsTrigger>
          <TabsTrigger value="pre-treino">Pré-treino</TabsTrigger>
          <TabsTrigger value="pos-treino">Pós-treino</TabsTrigger>
        </TabsList>

        {Object.entries(nutritionTips).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
