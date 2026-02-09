
'use client';

import { use, useState } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dumbbell, 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PlanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const planRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid, 'trainingPlans', id);
  }, [db, user, id]);

  const { data: plan, isLoading } = useDoc(planRef);

  const toggleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(i => i !== exerciseId) 
        : [...prev, exerciseId]
    );
  };

  if (isLoading) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!plan) return <div className="p-8 text-center py-20">Treino não encontrado.</div>;

  const progress = Math.round((completedExercises.length / (plan.exercises?.length || 1)) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-none">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader 
          title={plan.name} 
          subtitle="Siga as instruções do seu professor e registre seu progresso." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Lista de Exercícios */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {plan.exercises?.map((ex: any, index: number) => (
            <Card 
              key={ex.id} 
              className={cn(
                "rounded-[2rem] border-none shadow-sm transition-all overflow-hidden",
                completedExercises.includes(ex.id) ? "bg-green-50 opacity-80" : "bg-white"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner",
                      completedExercises.includes(ex.id) ? "bg-green-500 text-white" : "bg-muted text-primary"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{ex.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                          {ex.equipmentType}
                        </Badge>
                        {ex.difficulty && (
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {ex.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleComplete(ex.id)}
                    className={cn(
                      "rounded-full h-12 w-12",
                      completedExercises.includes(ex.id) ? "text-green-600 bg-green-100" : "text-muted-foreground hover:bg-primary/5"
                    )}
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-muted/30 p-3 rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase opacity-50">Séries</p>
                    <p className="text-lg font-black">{ex.targetSets || ex.sets}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase opacity-50">Reps</p>
                    <p className="text-lg font-black">{ex.targetReps || ex.reps}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase opacity-50">Descanso</p>
                    <p className="text-lg font-black">{ex.targetRest || ex.rest || '60s'}</p>
                  </div>
                </div>

                {ex.notes && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-3 items-start">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 leading-relaxed italic">
                      {ex.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar de Progresso */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground overflow-hidden sticky top-8">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-bold">Resumo da Sessão</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Mantenha o foco até o final!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center gap-2">
                <div className="text-6xl font-black">{progress}%</div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold uppercase opacity-70">Tempo Est.</p>
                  <p className="text-xl font-bold">45 min</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-bold uppercase opacity-70">Calorias</p>
                  <p className="text-xl font-bold">320 kcal</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="h-5 w-5 text-green-300" />
                  Postura verificada pelo Prof.
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  Alta intensidade sugerida.
                </div>
              </div>

              <Button 
                disabled={progress < 100}
                className="w-full h-14 rounded-2xl bg-white text-primary font-black text-lg hover:bg-white/90 shadow-lg disabled:opacity-50 disabled:bg-white/20"
              >
                CONCLUIR TREINO
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
