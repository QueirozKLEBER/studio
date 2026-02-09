'use client';

import { useState, use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  muscleGroups,
  exercises as allExercises,
  Exercise,
} from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldAlert, Zap } from 'lucide-react';

type ExercisePageProps = {
  params: Promise<{
    muscle: string;
  }>;
};

export default function ExerciseListPage({ params }: ExercisePageProps) {
  const { muscle } = use(params);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const muscleGroup = muscleGroups.find((m) => m.id === muscle);
  const exercises = allExercises[muscle as keyof typeof allExercises] || [];

  if (!muscleGroup) {
    notFound();
  }

  const videoPlaceholder = placeHolderImages.find(
    (img) => img.id === 'exercise-video-placeholder'
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageHeader
        title={muscleGroup.name}
        subtitle={`Exercícios focados em ${muscleGroup.name.toLowerCase()} para você atingir seus objetivos.`}
      />
      
      {exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="flex flex-col rounded-3xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-50 text-primary border-none text-[10px] font-bold uppercase">
                    {exercise.equipmentType}
                  </Badge>
                  <Badge className="text-[10px] font-bold uppercase">
                    {exercise.difficulty}
                  </Badge>
                </div>
                <CardTitle className="font-bold text-xl">{exercise.name}</CardTitle>
                <CardDescription className="font-medium text-xs">
                  {exercise.sets} séries x {exercise.reps} repetições
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exercise.description}
                </p>
                <p className="text-[10px] font-bold mt-4 text-primary uppercase">
                  Músculos: {exercise.muscleGroup} {exercise.secondaryMuscles.length > 0 && `+ ${exercise.secondaryMuscles.join(', ')}`}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full rounded-2xl font-bold transition-transform active:scale-95"
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border-dashed border-2 bg-transparent w-full">
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center italic">Nenhum exercício encontrado para este grupo muscular.</p>
            </CardContent>
        </Card>
      )}

      <Dialog
        open={!!selectedExercise}
        onOpenChange={(isOpen) => !isOpen && setSelectedExercise(null)}
      >
        <DialogContent className="max-w-4xl p-0 rounded-3xl overflow-hidden border-none bg-white">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 md:p-10">
              <DialogHeader className="mb-6">
                <div className="flex gap-2 mb-2">
                   <Badge variant="outline" className="rounded-full border-primary text-primary font-bold">{selectedExercise?.equipmentType}</Badge>
                   <Badge variant="outline" className="rounded-full border-secondary text-secondary font-bold">{selectedExercise?.difficulty}</Badge>
                </div>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {selectedExercise?.name}
                </DialogTitle>
                <div className="flex gap-4 mt-2 text-xs font-bold uppercase text-muted-foreground">
                    <span>Séries: {selectedExercise?.sets}</span>
                    <span>Reps: {selectedExercise?.reps}</span>
                    <span>Descanso: {selectedExercise?.rest}</span>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner relative">
                    <Image
                      src={selectedExercise?.gifPrincipalUrl || videoPlaceholder?.imageUrl || ''}
                      alt={selectedExercise?.name || "Vídeo do exercício"}
                      fill
                      className="object-cover"
                      data-ai-hint="fitness workout"
                    />
                    {!selectedExercise?.gifPrincipalUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                              <Zap className="h-8 w-8 text-white" />
                          </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Execução Correta
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      {selectedExercise?.executionInstructions || selectedExercise?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Dicas do Personal</h4>
                    <ul className="space-y-3">
                      {selectedExercise?.tips.map((tip, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <Zap className="h-3 w-3" />
                          </div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 bg-red-50 rounded-3xl border border-red-100">
                    <h4 className="font-bold text-sm text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Erros Comuns
                    </h4>
                    <ul className="space-y-2">
                      {selectedExercise?.commonErrors.map((error, index) => (
                        <li key={index} className="text-xs text-red-700/80 font-medium">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100">
                    <h4 className="font-bold text-sm text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Dicas de Segurança
                    </h4>
                    <ul className="space-y-2">
                      {selectedExercise?.safetyTips.map((tip, index) => (
                        <li key={index} className="text-xs text-orange-700/80 font-medium">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
