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
    { label: 'Professores', value: trainers?.length || 0, icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Alunos Ativos', value: students?.length || 0, icon: Users, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Assinaturas', value: 18, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ações', value: 45, icon: Activity, color: 'text-white', bg: 'bg-white/5' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Painel Administrador" 
        subtitle="Controle total sobre professores, alunos e finanças do sistema." 
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border border-white/5 shadow-xl bg-card overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className={cn("p-4 rounded-2xl shadow-inner", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white/5 pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Professores Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 font-black text-[10px] uppercase">
              <Link href="/admin/trainers">Ver Todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {trainers?.slice(0, 5).map(trainer => (
              <div key={trainer.id} className="flex items-center justify-between p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                    {trainer.firstName?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="font-black text-sm text-white uppercase tracking-tight">{trainer.firstName} {trainer.lastName}</p>
                    <p className="text-[10px] text-white/40 font-bold italic">{trainer.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] font-black border-primary/30 text-primary">ATIVO</Badge>
              </div>
            ))}
            {(!trainers || trainers.length === 0) && (
              <p className="text-center py-10 text-[10px] font-black uppercase text-white/20 italic tracking-widest">Nenhum professor registrado</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="bg-white/5 pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Gestão de Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              Gerenciar Planos de Preço
              <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              Auditoria de Pagamentos
              <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              Relatórios de Performance
              <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              Suporte e Tickets
              <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
