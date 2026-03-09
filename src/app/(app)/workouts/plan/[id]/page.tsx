
'use client';

import { use, useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { exercises as catalogExercises } from '@/lib/placeholder-data';

export default function PlanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, profile } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

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
    
    const duration = Math.round((Date.now() - startTime) / 60000); // Diferença em minutos

    setIsFinishing(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'workoutHistory'), {
        planId: id,
        planName: plan.name,
        completedAt: serverTimestamp(),
        exerciseCount: plan.exercises?.length || 0,
        completedExercisesCount: completedExercises.length,
        duration: duration
      });

      toast({
        title: "Treino Concluído! 🏆",
        description: `Trabalho finalizado em ${duration} minutos.`,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao salvar",
        description: "Não foi possível registrar seu treino.",
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
        {plan.allowPdfDownload && (
          <Button variant="outline" className="rounded-xl h-12 border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
        )}
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
                  "rounded-[2rem] border-none shadow-sm transition-all overflow-hidden cursor-pointer hover:shadow-md group",
                  completedExercises.includes(exId) ? "bg-green-50 opacity-90" : "bg-white"
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={gifUrl || videoPlaceholder?.imageUrl || ''}
                    alt={enrichedEx?.name || "Exercício"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transition-colors",
                        completedExercises.includes(exId) ? "bg-green-500 text-white" : "bg-muted text-primary"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">
                          {enrichedEx?.name || "Exercício"}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase mt-1">
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
                        completedExercises.includes(exId) ? "text-green-600 bg-green-100 scale-110" : "text-muted-foreground hover:bg-primary/5"
                      )}
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-muted/30 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-bold uppercase opacity-50">Séries</p>
                      <p className="text-lg font-black">{enrichedEx?.targetSets || '4'}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-bold uppercase opacity-50">Reps</p>
                      <p className="text-lg font-black">{enrichedEx?.targetReps || '12'}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-bold uppercase opacity-50">Descanso</p>
                      <p className="text-lg font-black">{enrichedEx?.targetRest || '60s'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground overflow-hidden sticky top-8">
            <CardContent className="p-8 space-y-8">
              <div className="text-center">
                <p className="text-xs font-bold uppercase opacity-70 tracking-widest mb-2">Progresso Atual</p>
                <div className="text-6xl font-black">{progress}%</div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-white transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="h-5 w-5 text-green-300" />
                  Intensidade: {plan.difficulty?.toUpperCase()}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  Mente no músculo ativada.
                </div>
              </div>

              <Button 
                onClick={handleFinishWorkout}
                disabled={progress < 100 || isFinishing}
                className="w-full h-16 rounded-3xl bg-white text-primary font-black text-lg hover:bg-white/90 shadow-lg disabled:opacity-50 transition-transform active:scale-95"
              >
                {isFinishing ? 'SALVANDO...' : 'CONCLUIR TREINO'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExerciseId(null)}>
        <DialogContent className="max-w-4xl p-0 rounded-[2.5rem] overflow-hidden border-none bg-white">
          <ScrollArea className="max-h-[90vh]">
            {selectedExercise && (
              <div className="p-6 md:p-10">
                <DialogHeader className="mb-8">
                  <Badge variant="outline" className="w-fit mb-3 rounded-full border-primary text-primary font-bold uppercase">
                    {selectedExercise.equipmentType}
                  </Badge>
                  <DialogTitle className="text-4xl font-black uppercase tracking-tighter">
                    {selectedExercise.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="aspect-video bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-inner relative">
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
                      <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase">
                        <Zap className="h-6 w-6 text-primary" />
                        Instruções
                      </h3>
                      <div className="text-sm leading-relaxed text-muted-foreground bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                        {selectedExercise.executionInstructions || "Execute o movimento de forma controlada, mantendo a postura."}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest mb-4 opacity-50">Orientações do Professor</h4>
                      <div className="bg-muted/30 p-6 rounded-3xl border border-muted italic text-sm font-bold">
                        "{selectedExercise.notes || "Foco total na contração máxima."}"
                      </div>
                    </div>

                    <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                      <h4 className="font-black text-sm text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Erros Comuns
                      </h4>
                      <ul className="space-y-2">
                        {(selectedExercise.commonErrors || ["Movimento rápido demais.", "Perda da postura."]).map((error: string, index: number) => (
                          <li key={index} className="text-xs text-red-700/70 font-bold flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-red-400 rounded-full" />
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
