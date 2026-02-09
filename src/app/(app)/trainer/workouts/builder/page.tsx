
'use client';

import { useState, Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { muscleGroups, exercises as allExercises, Exercise } from '@/lib/placeholder-data';
import { Search, Plus, Trash2, GripVertical, Save, Send, Dumbbell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDocumentNonBlocking } from '@/firebase';

type WorkoutExercise = Exercise & {
  targetSets: string;
  targetReps: string;
  targetRest: string;
  notes: string;
};

function BuilderContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('peito');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const filteredExercises = allExercises[selectedMuscle as keyof typeof allExercises]?.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      toast({ variant: 'destructive', title: "Erro", description: "Aluno não identificado. Volte para a lista de alunos." });
      return;
    }
    if (!workoutName || currentWorkout.length === 0) {
      toast({ variant: 'destructive', title: "Erro", description: "Dê um nome ao treino e adicione exercícios." });
      return;
    }

    setIsSaving(true);
    try {
      const planRef = doc(collection(db, 'users', studentId, 'trainingPlans'));
      await setDoc(planRef, {
        id: planRef.id,
        name: workoutName,
        userId: studentId,
        exercises: currentWorkout,
        createdAt: serverTimestamp(),
        status: 'active'
      });

      toast({ title: "Treino Liberado", description: `O treino foi enviado para o aluno.` });
      router.push(`/trainer/students/${studentId}`);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro", description: "Falha ao salvar o treino." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Montador de Treino" 
          subtitle={studentId ? "Personalizando treino para o aluno." : "Crie treinos de elite."} 
        />
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button onClick={handleSaveWorkout} className="rounded-2xl font-bold" disabled={isSaving}>
            <Send className="h-4 w-4 mr-2" />
            Publicar Treino
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Biblioteca de Exercícios */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
          <Card className="rounded-[2.5rem] border-none shadow-sm flex flex-col h-full bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Biblioteca</CardTitle>
              <div className="space-y-4 pt-2">
                <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
                  <SelectTrigger className="rounded-2xl border-none bg-muted">
                    <SelectValue placeholder="Músculo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {muscleGroups.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar exercício..." 
                    className="pl-10 rounded-2xl border-none bg-muted"
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
                    className="w-full text-left p-4 rounded-3xl bg-muted/50 hover:bg-primary/5 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-sm">{ex.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{ex.equipmentType}</p>
                    </div>
                    <Plus className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Construtor do Treino */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden h-full">
          <Card className="rounded-[2.5rem] border-none shadow-sm flex flex-col h-full bg-white">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutName" className="font-bold">Nome do Treino</Label>
                  <Input 
                    id="workoutName"
                    placeholder="Ex: Peito e Tríceps - Hipertrofia" 
                    className="rounded-2xl text-xl font-bold border-none bg-muted h-14"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentWorkout.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                    <Dumbbell className="h-16 w-16 mb-4" />
                    <p className="font-bold">Nenhum exercício adicionado ainda.</p>
                    <p className="text-sm">Selecione exercícios ao lado para começar.</p>
                  </div>
                ) : (
                  currentWorkout.map((ex, index) => (
                    <Card key={ex.id} className="rounded-3xl border border-muted-foreground/10 bg-muted/20 overflow-hidden">
                      <div className="p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-lg uppercase tracking-tight">{index + 1}. {ex.name}</h4>
                            <Badge variant="outline" className="text-[10px] font-bold border-primary text-primary">{ex.equipmentType}</Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => removeExercise(ex.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase opacity-70">Séries</Label>
                            <Input 
                              value={ex.targetSets} 
                              onChange={(e) => updateExercise(ex.id, 'targetSets', e.target.value)}
                              className="rounded-xl h-9 bg-white border-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase opacity-70">Reps/Tempo</Label>
                            <Input 
                              value={ex.targetReps} 
                              onChange={(e) => updateExercise(ex.id, 'targetReps', e.target.value)}
                              className="rounded-xl h-9 bg-white border-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase opacity-70">Descanso</Label>
                            <Input 
                              value={ex.targetRest} 
                              onChange={(e) => updateExercise(ex.id, 'targetRest', e.target.value)}
                              className="rounded-xl h-9 bg-white border-none shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase opacity-70">Obs. Técnicas</Label>
                          <Input 
                            value={ex.notes} 
                            placeholder="Adicione instruções..."
                            onChange={(e) => updateExercise(ex.id, 'notes', e.target.value)}
                            className="rounded-xl h-9 bg-white border-none shadow-sm"
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutBuilder() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse bg-muted h-screen" />}>
      <BuilderContent />
    </Suspense>
  );
}
