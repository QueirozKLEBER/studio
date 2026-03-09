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
import { ShieldAlert, Zap, PlayCircle } from 'lucide-react';

export async function generateStaticParams() {
  return muscleGroups.map((group) => ({
    muscle: group.id,
  }));
}

export default function ExerciseListPage({ params }: { params: Promise<{ muscle: string }> }) {
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
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={exercise.gifPrincipalUrl}
                  alt={exercise.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
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
            <CardContent className="pt-6 text-center italic text-muted-foreground">
                Nenhum exercício encontrado.
            </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedExercise} onOpenChange={(isOpen) => !isOpen && setSelectedExercise(null)}>
        <DialogContent className="max-w-4xl p-0 rounded-3xl overflow-hidden border-none bg-white">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 md:p-10">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold">{selectedExercise?.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden relative">
                  {selectedExercise?.gifPrincipalUrl && (
                    <Image src={selectedExercise.gifPrincipalUrl} alt="Execução" fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" /> Instruções
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">{selectedExercise?.executionInstructions}</p>
                  </div>
                  <div className="p-5 bg-red-50 rounded-3xl border border-red-100">
                    <h4 className="font-bold text-red-600 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Erros Comuns
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {selectedExercise?.commonErrors.map((err, i) => <li key={i} className="text-xs text-red-700">• {err}</li>)}
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
