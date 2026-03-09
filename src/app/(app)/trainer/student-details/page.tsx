'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dumbbell, Activity, TrendingUp, ArrowLeft, Utensils, Zap, Flame, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

function StudentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useUser();
  
  const studentRef = useMemoFirebase(() => id ? doc(db, 'users', id) : null, [db, id]);
  const historyQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc')) : null, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: history } = useCollection(historyQuery);

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!student) return <div className="p-8 text-center py-20">Aluno não encontrado.</div>;

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
        <PageHeader title={`${student.firstName} ${student.lastName}`} subtitle="Gestão do aluno." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] bg-white p-6">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4">{student.firstName[0]}</div>
            <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
            <Badge className="mt-2">PLANO PERSONAL</Badge>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] bg-white p-6">
          <CardHeader><CardTitle className="text-lg font-bold">Resumo</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
              <span className="text-xs font-bold uppercase">Treinos</span>
              <span className="text-xl font-bold">{history?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-white p-6">
          <Button className="w-full h-14 rounded-2xl font-bold">Montar Novo Treino</Button>
        </Card>
      </div>

      <Tabs defaultValue="report" className="mt-8">
        <TabsList className="bg-muted p-1 rounded-2xl">
          <TabsTrigger value="report" className="px-8 font-bold">Relatório de Atividades</TabsTrigger>
        </TabsList>
        <TabsContent value="report" className="mt-6">
          <Card className="rounded-[2.5rem] p-6">
            <ScrollArea className="h-[400px]">
              {history?.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {entry.activityType === 'cardio' ? <Flame className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{entry.planName}</p>
                    <p className="text-xs opacity-50">{entry.completedAt?.toDate().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDetailsPage() {
  return <Suspense fallback={<div>Carregando...</div>}><StudentDetailsContent /></Suspense>;
}
