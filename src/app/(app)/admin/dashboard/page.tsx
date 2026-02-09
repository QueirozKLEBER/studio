
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { GraduationCap, Users, CreditCard, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { profile } = useUser();
  const db = useFirestore();

  const trainersQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'trainer'));
  }, [db, profile]);

  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);

  const { data: trainers } = useCollection(trainersQuery);
  const { data: students } = useCollection(studentsQuery);

  const stats = [
    { label: 'Professores', value: trainers?.length || 0, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Alunos Ativos', value: students?.length || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Assinaturas Ativas', value: 18, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Log de Ações', value: 45, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-none">
      <PageHeader 
        title="Painel Administrador" 
        subtitle="Controle total sobre professores, alunos e finanças do MFIT." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Professores Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/trainers">Ver Todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainers?.slice(0, 5).map(trainer => (
              <div key={trainer.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    {trainer.firstName?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{trainer.firstName} {trainer.lastName}</p>
                    <p className="text-[10px] text-muted-foreground">{trainer.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">ATIVO</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Gestão de Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold justify-between px-6 border-2">
              Gerenciar Planos de Preço
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold justify-between px-6 border-2">
              Auditoria de Pagamentos
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold justify-between px-6 border-2">
              Relatórios de Performance
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold justify-between px-6 border-2">
              Suporte e Tickets
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
