'use client';

import { useState } from 'react';
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
  DialogDescription,
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

type ExercisePageProps = {
  params: {
    muscle: string;
  };
};

export default function ExerciseListPage({ params }: ExercisePageProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  const muscleGroup = muscleGroups.find((m) => m.id === params.muscle);
  const exercises =
    allExercises[params.muscle as keyof typeof allExercises] || [];

  if (!muscleGroup) {
    notFound();
  }

  const videoPlaceholder = placeHolderImages.find(
    (img) => img.id === 'exercise-video-placeholder'
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={muscleGroup.name}
        subtitle={`Exercícios focados em ${muscleGroup.name.toLowerCase()} para você atingir seus objetivos.`}
      />
      
      {exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{exercise.name}</CardTitle>
                <CardDescription>
                  {exercise.sets} séries x {exercise.reps} repetições
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Descanso: {exercise.rest}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full"
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">Nenhum exercício encontrado para este grupo muscular.</p>
            </CardContent>
        </Card>
      )}

      <Dialog
        open={!!selectedExercise}
        onOpenChange={(isOpen) => !isOpen && setSelectedExercise(null)}
      >
        <DialogContent className="max-w-3xl">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-1">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl mb-2">
                  {selectedExercise?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {videoPlaceholder && (
                    <Image
                      src={videoPlaceholder.imageUrl}
                      alt="Vídeo do exercício"
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                      data-ai-hint={videoPlaceholder.imageHint}
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-lg mb-2">
                    Descrição
                  </h3>
                  <DialogDescription>
                    {selectedExercise?.description}
                  </DialogDescription>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-lg mb-2">
                    Dicas de Execução
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {selectedExercise?.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
