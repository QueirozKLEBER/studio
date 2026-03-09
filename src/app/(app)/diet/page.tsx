
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Utensils, Calendar, Clock, Apple, Zap, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function StudentDietPage() {
  const { user } = useUser();
  const db = useFirestore();

  const dietsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'dietSuggestions'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: diets, isLoading } = useCollection(dietsQuery);

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-full overflow-x-hidden">
      <PageHeader 
        title="Minha Dieta" 
        subtitle="Confira as orientações nutricionais preparadas pelo seu professor." 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          <Card className="h-64 animate-pulse rounded-[2.5rem] bg-card border-white/5" />
        </div>
      ) : diets && diets.length > 0 ? (
        <div className="flex flex-col gap-8">
          {diets.map((diet) => (
            <Card key={diet.id} className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
              <CardHeader className="bg-white/5 p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-primary text-primary font-black uppercase tracking-widest text-[10px]">
                    {diet.createdAt?.toDate().toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-tight text-white">{diet.title}</CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 mt-2 tracking-widest">
                  <Calendar className="h-3 w-3 text-primary" />
                  Atualizado pelo seu personal
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                      <Apple className="h-5 w-5 text-primary" />
                      Plano Alimentar
                    </h3>
                    <div className="bg-black/20 p-6 rounded-[2rem] whitespace-pre-wrap leading-relaxed text-sm text-white/70 border border-white/5 font-medium italic">
                      {diet.description}
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                      <h4 className="font-black text-primary flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                        <Zap className="h-4 w-4" />
                        Dica de Elite
                      </h4>
                      <p className="text-sm text-white leading-relaxed font-bold">
                        A hidratação é fundamental. Beba pelo menos 35ml de água para cada kg de peso corporal ao longo do dia.
                      </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <h4 className="font-black text-white/60 flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                        <Info className="h-4 w-4 text-primary" />
                        Aviso
                      </h4>
                      <p className="text-xs text-white/40 leading-relaxed font-medium">
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
        <Card className="rounded-[3rem] border-dashed border-2 border-white/10 bg-transparent p-12 text-center flex flex-col items-center gap-6">
          <div className="p-6 bg-card rounded-full shadow-inner">
            <Utensils className="h-16 w-16 text-white/20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Nenhuma dieta sugerida</h3>
            <p className="text-white/40 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-widest leading-relaxed">
              Seu personal ainda não enviou uma orientação alimentar. 
              Foque nos treinos e aguarde a atualização do seu plano!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
