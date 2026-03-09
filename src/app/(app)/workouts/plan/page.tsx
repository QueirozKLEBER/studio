'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle2, Info, ShieldCheck, Zap, PlayCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { exercises as catalogExercises } from '@/lib/placeholder-data';

function PlanView() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, profile } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const planRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(db, 'users', user.uid, 'trainingPlans', id);
  }, [db, user, id]);

  const { data: plan, isLoading } = useDoc(planRef);
  const flatCatalog = useMemo(() => Object.values(catalogExercises).flat(), []);

  const getEnrichedExercise = (planEx: any) => {
    if (!planEx) return null;
    const planId = (planEx.id || '').toString().toLowerCase();
    const catalogMatch = flatCatalog.find(ex => ex.id.toLowerCase() === planId);
    return catalogMatch ? { ...catalogMatch, ...planEx } : planEx;
  };

  const handleFinishWorkout = async () => {
    if (!user || !plan) return;
    setIsFinishing(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'workoutHistory'), {
        planId: id,
        planName: plan.name,
        completedAt: serverTimestamp(),
        exerciseCount: plan.exercises?.length || 0,
        completedExercisesCount: completedExercises.length
      });
      toast({ title: "Treino Concluído! 🏆" });
      router.push('/dashboard');
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar" });
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!plan) return <div className="p-8 text-center py-20">Treino não encontrado.</div>;

  const progress = Math.round((completedExercises.length / (plan.exercises?.length || 1)) * 100);
  const selectedExercise = selectedExerciseId ? getEnrichedExercise(plan.exercises.find((ex: any) => ex.id === selectedExerciseId)) : null;

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-6 w-6" /></Button>
        <PageHeader title={plan.name} subtitle="Execute com foco total." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-4">
          {plan.exercises?.map((ex: any, i: number) => {
            const enriched = getEnrichedExercise(ex);
            return (
              <Card key={i} onClick={() => setSelectedExerciseId(enriched.id)} className={cn("rounded-[2rem] overflow-hidden cursor-pointer", completedExercises.includes(enriched.id) && "bg-green-50")}>
                <div className="relative aspect-video bg-muted">
                  <Image src={enriched.gifPrincipalUrl} alt={enriched.name} fill className="object-cover" unoptimized />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase">{enriched.name}</h3>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setCompletedExercises(prev => prev.includes(enriched.id) ? prev.filter(p => p !== enriched.id) : [...prev, enriched.id])}}>
                      <CheckCircle2 className={cn("h-8 w-8", completedExercises.includes(enriched.id) ? "text-green-600" : "text-muted")} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="lg:col-span-4">
          <Card className="rounded-[2.5rem] bg-primary text-white p-8 sticky top-8">
            <h2 className="text-4xl font-black">{progress}%</h2>
            <Button onClick={handleFinishWorkout} disabled={progress < 100 || isFinishing} className="w-full mt-6 bg-white text-primary font-bold h-14 rounded-2xl">
              CONCLUIR TREINO
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return <Suspense fallback={<div>Carregando...</div>}><PlanView /></Suspense>;
}
