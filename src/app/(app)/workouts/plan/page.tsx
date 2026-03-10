'use client';

import { use, useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Zap,
  PlayCircle,
  AlertTriangle,
  Download,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { exercises as catalogExercises } from '@/lib/placeholder-data';

function PlanExecutionContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, profile } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    const start = Date.now();
    setStartTime(start);
    
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const planRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(db, 'users', user.uid, 'trainingPlans', id);
  }, [db, user, id]);

  const { data: plan, isLoading } = useDoc(planRef);

  const flatCatalog = useMemo(() => Object.values(catalogExercises).flat(), []);

  const getEnrichedExercise = (planEx: any) => {
    if (!planEx) return null;
    const planId = (planEx.id || '').toString().trim().toLowerCase();
    const catalogMatch = flatCatalog.find(ex => ex.id.toString().trim().toLowerCase() === planId);
    return catalogMatch ? { ...catalogMatch, ...planEx } : planEx;
  };

  const toggleComplete = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(i => i !== exerciseId) 
        : [...prev, exerciseId]
    );
  };

  const handleFinishWorkout = async () => {
    if (!user || !plan || !startTime) return;
    
    const duration = Math.round((Date.now() - startTime) / 60000);

    setIsFinishing(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'workoutHistory'), {
        planId: id,
        planName: plan.name,
        completedAt: serverTimestamp(),
        exerciseCount: plan.exercises?.length || 0,
        completedExercisesCount: completedExercises.length,
        duration: duration,
        type: 'automated'
      });

      toast({
        title: "Treino Finalizado! 🏆",
        description: `Excelente trabalho! Sessão de ${duration} min concluída.`,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao salvar",
        description: "Não foi possível registrar sua evolução.",
      });
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!plan) return <div className="p-8 text-center py-20">Treino não encontrado.</div>;

  const progress = Math.round((completedExercises.length / (plan.exercises?.length || 1)) * 100);
  const videoPlaceholder = placeHolderImages.find(img => img.id === 'exercise-video-placeholder');

  const selectedExercise = selectedExerciseId 
    ? getEnrichedExercise(plan.exercises.find((ex: any) => ex.id === selectedExerciseId))
    : null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-none pb-20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <PageHeader 
            title={plan.name} 
            subtitle={`${plan.workoutType || 'Geral'} • ${plan.difficulty?.toUpperCase() || 'INTERMEDIÁRIO'}`} 
          />
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-black text-primary tabular-nums">{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        <div className="lg:col-span-8 flex flex-col gap-4">
          {plan.exercises?.map((planEx: any, index: number) => {
            const enrichedEx = getEnrichedExercise(planEx);
            const gifUrl = enrichedEx?.gifPrincipalUrl;
            const exId = enrichedEx?.id || `fallback-${index}`;

            return (
              <Card 
                key={exId} 
                onClick={() => setSelectedExerciseId(exId)}
                className={cn(
                  "rounded-[2rem] border border-white/5 transition-all overflow-hidden cursor-pointer hover:border-primary/30 group bg-card",
                  completedExercises.includes(exId) ? "opacity-60 grayscale-[0.5]" : ""
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/20">
                  <Image
                    src={gifUrl || videoPlaceholder?.imageUrl || ''}
                    alt={enrichedEx?.name || "Exercício"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {completedExercises.includes(exId) && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[2px]">
                      <CheckCircle2 className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transition-colors",
                        completedExercises.includes(exId) ? "bg-green-500 text-white" : "bg-white/5 text-primary"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">
                          {enrichedEx?.name || "Exercício"}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary uppercase mt-1 tracking-widest">
                          {enrichedEx?.equipmentType || "Livre"}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => toggleComplete(exId, e)}
                      className={cn(
                        "rounded-full h-12 w-12 transition-all",
                        completedExercises.includes(exId) ? "text-green-500 bg-green-500/10 scale-110" : "text-white/20 hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Séries</p>
                      <p className="text-lg font-black text-white">{enrichedEx?.targetSets || '4'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Reps</p>
                      <p className="text-lg font-black text-white">{enrichedEx?.targetReps || '12'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Descanso</p>
                      <p className="text-lg font-black text-white">{enrichedEx?.targetRest || '60'}s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-white overflow-hidden sticky top-8 p-8 space-y-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-2">Treino em Andamento</p>
              <div className="text-6xl font-black tracking-tighter">{progress}%</div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mt-6">
                <div 
                  className="h-full bg-white transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-5 w-5 text-white/60" />
                Intensidade: {plan.difficulty || 'Intermediário'}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <Clock className="h-5 w-5 text-white/60" />
                Tempo Médio: {plan.estimatedDuration || '60'} min
              </div>
            </div>

            <Button 
              onClick={handleFinishWorkout}
              disabled={progress < 100 || isFinishing}
              className="w-full h-20 rounded-[2rem] bg-white text-primary font-black text-lg hover:bg-white/90 shadow-2xl disabled:opacity-50 transition-all active:scale-95 uppercase tracking-tight"
            >
              {isFinishing ? <Loader2 className="animate-spin h-6 w-6" /> : 'CONCLUIR TREINO'}
            </Button>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExerciseId(null)}>
        <DialogContent className="max-w-4xl p-0 rounded-[2.5rem] overflow-hidden border-none bg-card text-white">
          <ScrollArea className="max-h-[90vh]">
            {selectedExercise && (
              <div className="p-6 md:p-10 space-y-8">
                <DialogHeader>
                  <Badge className="w-fit mb-3 rounded-full bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[10px]">
                    {selectedExercise.equipmentType}
                  </Badge>
                  <DialogTitle className="text-4xl font-black uppercase tracking-tighter leading-none">
                    {selectedExercise.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="aspect-video bg-black/40 rounded-[2.5rem] overflow-hidden shadow-inner relative border border-white/5">
                      {selectedExercise.gifPrincipalUrl && (
                        <Image
                          src={selectedExercise.gifPrincipalUrl}
                          alt={selectedExercise.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-widest text-primary">
                        <Zap className="h-4 w-4" />
                        Instruções de Execução
                      </h3>
                      <div className="text-sm leading-relaxed text-white/60 bg-white/5 p-6 rounded-[2rem] border border-white/5 font-medium italic">
                        {selectedExercise.executionInstructions || "Mantenha a coluna neutra e execute o movimento de forma controlada, focando na contração do músculo alvo."}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 text-white/20">Nota do Seu Professor</h4>
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 italic text-sm font-bold text-primary">
                        "{selectedExercise.notes || "Foco total na técnica perfeita. Menos carga, mais consciência."}"
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                      <h4 className="font-black text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Avisos de Segurança
                      </h4>
                      <ul className="space-y-3">
                        {(selectedExercise.commonErrors || ["Movimento rápido demais.", "Perda da postura ideal."]).map((error: string, index: number) => (
                          <li key={index} className="text-xs text-white/60 font-bold flex items-center gap-3">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PlanExecutionPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse bg-muted h-screen" />}>
      <PlanExecutionContent />
    </Suspense>
  );
}