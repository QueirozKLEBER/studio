
'use client';

import { useState, Suspense, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { muscleGroups, exercises as allExercises, Exercise } from '@/lib/placeholder-data';
import { Search, Plus, Trash2, GripVertical, Save, Send, Dumbbell, Loader2, FileText, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useDoc } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemoFirebase } from '@/firebase';

type WorkoutExercise = Exercise & {
  targetSets: string;
  targetReps: string;
  targetRest: string;
  notes: string;
};

function BuilderLoading() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] w-full max-w-none">
       <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-[2.5rem]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
       </div>
    </div>
  );
}

function BuilderContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const planId = searchParams.get('planId');
  
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('peito');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('Hipertrofia');
  const [difficulty, setDifficulty] = useState('intermediario');
  const [allowPdf, setAllowPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const planRef = useMemoFirebase(() => {
    if (!studentId || !planId) return null;
    return doc(db, 'users', studentId, 'trainingPlans', planId);
  }, [db, studentId, planId]);

  const { data: existingPlan, isLoading: isPlanLoading } = useDoc(planRef);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (existingPlan) {
      setWorkoutName(existingPlan.name || '');
      setWorkoutType(existingPlan.workoutType || 'Hipertrofia');
      setDifficulty(existingPlan.difficulty || 'intermediario');
      setAllowPdf(existingPlan.allowPdfDownload || false);
      setCurrentWorkout(existingPlan.exercises || []);
    }
  }, [existingPlan]);

  const filteredExercises = useMemo(() => {
    const list = allExercises[selectedMuscle as keyof typeof allExercises] || [];
    if (!searchTerm) return list;
    return list.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [selectedMuscle, searchTerm]);

  if (!hasMounted) return <BuilderLoading />;

  const addExercise = (ex: Exercise) => {
    if (currentWorkout.some(w => w.id === ex.id)) {
      toast({ title: "Aviso", description: "Este exercício já foi adicionado." });
      return;
    }
    setCurrentWorkout([...currentWorkout, { 
      ...ex, 
      targetSets: '4', 
      targetReps: '12', 
      targetRest: '60s',
      notes: '' 
    }]);
  };

  const removeExercise = (id: string) => {
    setCurrentWorkout(currentWorkout.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof WorkoutExercise, value: string) => {
    setCurrentWorkout(currentWorkout.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSaveWorkout = async () => {
    if (!studentId) {
      toast({ variant: 'destructive', title: "Erro", description: "Aluno não identificado." });
      return;
    }
    if (!workoutName || currentWorkout.length === 0) {
      toast({ variant: 'destructive', title: "Erro", description: "Dê um nome ao treino e adicione exercícios." });
      return;
    }

    setIsSaving(true);
    try {
      const finalPlanRef = planId 
        ? doc(db, 'users', studentId, 'trainingPlans', planId)
        : doc(collection(db, 'users', studentId, 'trainingPlans'));

      const planData = {
        id: finalPlanRef.id,
        name: workoutName,
        workoutType,
        difficulty,
        allowPdfDownload: allowPdf,
        userId: studentId,
        exercises: currentWorkout,
        updatedAt: serverTimestamp(),
        status: 'active'
      };

      if (planId) {
        await updateDoc(finalPlanRef, planData);
      } else {
        await setDoc(finalPlanRef, {
          ...planData,
          createdAt: serverTimestamp(),
        });
      }

      toast({ 
        title: planId ? "Treino Atualizado" : "Treino Liberado", 
        description: `O treino de ${workoutType} foi enviado.` 
      });
      router.push(`/trainer/student-details?id=${studentId}`);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro", description: "Falha ao salvar o treino." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 w-full max-w-none">
      {isPlanLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader 
              title={planId ? "Editar Treino" : "Montador de Treino"} 
              subtitle="Configure o nível técnico e restrições da planilha." 
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveWorkout} className="rounded-2xl h-14 px-8 font-black bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95" disabled={isSaving}>
                <Send className="h-5 w-5 mr-2" />
                {planId ? "SALVAR ALTERAÇÕES" : "LIBERAR TREINO"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
                <CardHeader className="bg-white/5 pb-4">
                  <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Configurações do Treino
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Tipo de Treino</Label>
                    <Input 
                      placeholder="Ex: Hipertrofia, Full Body" 
                      value={workoutType} 
                      onChange={(e) => setWorkoutType(e.target.value)}
                      className="rounded-xl h-12 bg-white/5 border-none font-bold text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Dificuldade</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="rounded-xl h-12 bg-white/5 border-none font-bold text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
                        <SelectItem value="iniciante">INICIANTE</SelectItem>
                        <SelectItem value="intermediario">INTERMEDIÁRIO</SelectItem>
                        <SelectItem value="avancado">AVANÇADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-1">
                      <Label className="text-xs font-black uppercase text-white tracking-widest">Liberar PDF</Label>
                      <p className="text-[9px] font-bold text-white/40 uppercase">Permitir que o aluno baixe o treino.</p>
                    </div>
                    <Switch checked={allowPdf} onCheckedChange={setAllowPdf} className="data-[state=checked]:bg-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden h-[500px] flex flex-col">
                <CardHeader className="bg-white/5 pb-4">
                  <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Biblioteca de Exercícios</CardTitle>
                  <div className="space-y-3 pt-4">
                    <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
                      <SelectTrigger className="rounded-xl border-none bg-white/5 h-10 text-[10px] font-black uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
                        {muscleGroups.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                      <Input 
                        placeholder="BUSCAR..." 
                        className="pl-9 rounded-xl border-none bg-white/5 h-10 text-[10px] font-bold text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {filteredExercises.map(ex => (
                      <button 
                        key={ex.id}
                        onClick={() => addExercise(ex)}
                        className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-primary/10 border border-white/5 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-black text-xs text-white uppercase tracking-tight">{ex.name}</p>
                          <p className="text-[8px] text-primary uppercase font-black tracking-widest mt-1">{ex.equipmentType}</p>
                        </div>
                        <Plus className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
                <CardHeader className="bg-white/5 pb-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Nome da Planilha</Label>
                    <Input 
                      placeholder="Ex: Treino A - Superiores" 
                      className="rounded-2xl text-2xl font-black uppercase tracking-tight border-none bg-white/5 h-16 text-white"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {currentWorkout.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-white/10 gap-4">
                        <Dumbbell className="h-20 w-20" />
                        <p className="font-black uppercase tracking-[0.2em] text-sm italic">Nenhum exercício na planilha</p>
                      </div>
                    ) : (
                      currentWorkout.map((ex, index) => (
                        <div key={ex.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col gap-6 group hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-lg text-white uppercase tracking-tight">{ex.name}</h4>
                              <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase tracking-widest mt-1">{ex.equipmentType}</Badge>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10"
                              onClick={() => removeExercise(ex.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <Label className="text-[9px] font-black uppercase text-white/40">Séries</Label>
                              <Input 
                                value={ex.targetSets} 
                                onChange={(e) => updateExercise(ex.id, 'targetSets', e.target.value)}
                                className="rounded-xl h-11 bg-black/20 border-none font-black text-center text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-black uppercase text-white/40">Repetições</Label>
                              <Input 
                                value={ex.targetReps} 
                                onChange={(e) => updateExercise(ex.id, 'targetReps', e.target.value)}
                                className="rounded-xl h-11 bg-black/20 border-none font-black text-center text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-black uppercase text-white/40">Descanso</Label>
                              <Input 
                                value={ex.targetRest} 
                                onChange={(e) => updateExercise(ex.id, 'targetRest', e.target.value)}
                                className="rounded-xl h-11 bg-black/20 border-none font-black text-center text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-white/40">Instruções Adicionais</Label>
                            <Input 
                              value={ex.notes} 
                              placeholder="Foque na cadência 4020..."
                              onChange={(e) => updateExercise(ex.id, 'notes', e.target.value)}
                              className="rounded-xl h-11 bg-black/20 border-none font-bold text-white italic"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function WorkoutBuilder() {
  return (
    <Suspense fallback={<BuilderLoading />}>
      <BuilderContent />
    </Suspense>
  );
}
