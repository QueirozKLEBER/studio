'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { muscleGroups } from '@/lib/placeholder-data';
import * as MuscleIcons from '@/components/icons/muscle-groups';

type MuscleIconComponents = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
};

const iconComponents: MuscleIconComponents = MuscleIcons;

export default function WorkoutsPage() {
  const { user, profile } = useUser();
  const db = useFirestore();

  const plansQuery = useMemoFirebase(() => {
    if (!user || profile?.userType !== 'student') return null;
    return query(
      collection(db, 'users', user.uid, 'trainingPlans'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, profile]);

  const { data: plans, isLoading } = useCollection(plansQuery);

  // Se for Professor ou ADM, mostra a biblioteca de exercícios
  if (profile?.userType === 'trainer' || profile?.userType === 'admin') {
    return (
      <div className="flex flex-col gap-8 w-full">
        <PageHeader
          title="Biblioteca de Exercícios"
          subtitle="Consulte e selecione exercícios para montar treinos de elite."
        />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
          {muscleGroups.map((group) => {
            const IconComponent = iconComponents[group.icon];
            return (
              <Link key={group.id} href={`/workouts/${group.id}`} className="group">
                <Card className="h-full transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:-translate-y-1 rounded-3xl bg-card border border-white/5 shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                    {IconComponent && (
                      <div className="p-4 bg-primary/10 rounded-2xl">
                          <IconComponent className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    )}
                    <span className="font-headline font-bold text-lg text-white">
                      {group.name}
                    </span>
                    <div className="flex items-center text-xs text-primary font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100 uppercase tracking-tighter">
                      Ver biblioteca <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Se for Aluno, mostra apenas os treinos que o professor montou
  return (
    <div className="flex flex-col gap-8 w-full">
      <PageHeader
        title="Meus Treinos"
        subtitle="Aqui estão os treinos personalizados preparados pelo seu professor."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-48 rounded-[2.5rem] animate-pulse bg-muted/50" />)
        ) : plans && plans.length > 0 ? (
          plans.map((plan) => (
            <Card key={plan.id} className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden hover:shadow-primary/10 transition-all group">
              <CardHeader className="bg-white/5 pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-black border-none uppercase text-[10px] tracking-widest">
                    {plan.exercises?.length || 0} EXERCÍCIOS
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-black mt-4 uppercase tracking-tight text-white">{plan.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 font-bold text-xs uppercase text-white/40 mt-1">
                  <Calendar className="h-3 w-3" />
                  Liberado em {plan.createdAt?.toDate().toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-white/60 line-clamp-2 italic mb-6">
                  Foco total na técnica e progressão de carga conforme orientado pelo seu personal.
                </p>
                <Button asChild className="w-full h-14 rounded-2xl font-black text-lg bg-primary text-white shadow-lg transition-transform active:scale-95 uppercase tracking-tighter">
                  <Link href={`/workouts/plan/${plan.id}`}>
                    INICIAR TREINO
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="rounded-[3rem] border-dashed border-2 border-white/10 bg-transparent p-12 text-center flex flex-col items-center gap-6">
              <div className="p-6 bg-muted rounded-full">
                <AlertCircle className="h-16 w-16 text-white/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Nenhum treino encontrado</h3>
                <p className="text-white/40 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-widest">
                  Seu professor ainda está preparando sua planilha de treinos de elite. 
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}