
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Utensils, Calendar, Clock, Apple, Zap, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudentDietPage() {
  const { user } = useUser();
  const db = useFirestore();

  const dietsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'dietSuggestions'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: diets, isLoading } = useCollection(dietsQuery);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader 
        title="Minha Dieta" 
        subtitle="Confira as orientações nutricionais preparadas pelo seu professor." 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          <Card className="h-64 animate-pulse rounded-[2.5rem] bg-muted" />
        </div>
      ) : diets && diets.length > 0 ? (
        <div className="flex flex-col gap-8">
          {diets.map((diet) => (
            <Card key={diet.id} className="rounded-[2.5rem] border-none shadow-md bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-primary text-primary font-bold uppercase tracking-wider">
                    {diet.createdAt?.toDate().toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-tight">{diet.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3" />
                  Atualizado pelo seu personal
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Apple className="h-5 w-5 text-secondary" />
                      Plano Alimentar
                    </h3>
                    <div className="bg-muted/30 p-6 rounded-[2rem] whitespace-pre-wrap leading-relaxed text-sm text-muted-foreground border border-muted-foreground/10">
                      {diet.description}
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20">
                      <h4 className="font-bold text-secondary flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4" />
                        Dica Importante
                      </h4>
                      <p className="text-xs text-secondary-foreground/80 leading-relaxed font-medium">
                        A hidratação é fundamental. Beba pelo menos 35ml de água para cada kg de peso corporal ao longo do dia.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                      <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4" />
                        Aviso
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Estas são sugestões baseadas no seu objetivo. Consulte sempre um nutricionista para um plano clínico individualizado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-[3rem] border-dashed border-2 bg-transparent p-12 text-center flex flex-col items-center gap-6">
          <div className="p-6 bg-muted rounded-full">
            <Utensils className="h-16 w-16 text-muted-foreground opacity-30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-tight">Nenhuma dieta sugerida</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Seu personal ainda não enviou uma orientação alimentar. 
              Foque nos treinos e aguarde a atualização do seu plano!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
