'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      toast({ title: "Treino Concluído! 🏆", description: "Seu progresso foi registrado." });
      router.push('/dashboard');
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar" });
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!plan) return <div className="p-8 text-center py-20">Treino não encontrado.</div>;

  const progress = Math.round((completedExercises.length / (plan.exercises?.length || 1)) * 100);
  const selectedExercise = selectedExerciseId ? getEnrichedExercise(plan.exercises.find((ex: any) => ex.id === selectedExerciseId)) : null;
  const videoPlaceholder = placeHolderImages.find(img => img.id === 'exercise-video-placeholder');

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl"><ArrowLeft className="h-6 w-6" /></Button>
        <PageHeader title={plan.name} subtitle="Clique no exercício para ver orientações." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        <div className="lg:col-span-8 flex flex-col gap-4">
          {plan.exercises?.map((planEx: any, index: number) => {
            const enrichedEx = getEnrichedExercise(planEx);
            const exId = enrichedEx?.id || `fallback-${index}`;

            return (
              <Card 
                key={exId} 
                onClick={() => setSelectedExerciseId(exId)}
                className={cn(
                  "rounded-[2rem] border-none shadow-sm transition-all overflow-hidden cursor-pointer hover:shadow-md",
                  completedExercises.includes(exId) ? "bg-green-50" : "bg-white"
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={enrichedEx?.gifPrincipalUrl || videoPlaceholder?.imageUrl || ''}
                    alt={enrichedEx?.name || "Exercício"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-black", completedExercises.includes(exId) ? "bg-green-500 text-white" : "bg-muted text-primary")}>
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-black uppercase">{enrichedEx?.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedExercises(prev => prev.includes(exId) ? prev.filter(i => i !== exId) : [...prev, exId]);
                      }}
                      className={cn("rounded-full h-12 w-12", completedExercises.includes(exId) ? "text-green-600" : "text-muted-foreground")}
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-4">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground p-8 sticky top-8 text-center">
            <p className="text-xs font-bold uppercase opacity-70 tracking-widest mb-2">Progresso</p>
            <div className="text-6xl font-black">{isMounted ? progress : 0}%</div>
            <Button 
              onClick={handleFinishWorkout}
              disabled={progress < 100 || isFinishing}
              className="w-full h-16 rounded-3xl bg-white text-primary font-black text-lg mt-8 hover:bg-white/90"
            >
              {isFinishing ? 'SALVANDO...' : 'CONCLUIR TREINO'}
            </Button>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExerciseId(null)}>
        <DialogContent className="max-w-4xl p-0 rounded-[2.5rem] overflow-hidden border-none">
          <ScrollArea className="max-h-[90vh]">
            {selectedExercise && (
              <div className="p-6 md:p-10 bg-white">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-black uppercase">{selectedExercise.name}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video relative rounded-3xl overflow-hidden mb-6 bg-muted">
                  <Image src={selectedExercise.gifPrincipalUrl || videoPlaceholder?.imageUrl || ''} alt="Demo" fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instruções</h4>
                    <p className="text-sm text-muted-foreground mt-2">{selectedExercise.executionInstructions}</p>
                  </div>
                  {selectedExercise.tips && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExercise.tips.map((tip: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start text-xs font-bold p-3 bg-muted/30 rounded-xl">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PlanPage() {
  return <Suspense fallback={<div>Carregando...</div>}><PlanView /></Suspense>;
}