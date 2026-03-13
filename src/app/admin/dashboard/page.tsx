'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { GraduationCap, Users, CreditCard, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function AdminDashboard() {
  const { profile } = useUser();
  const db = useFirestore();

  const trainersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'trainer')), [db]);
  const studentsQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'student')), [db]);

  const { data: trainers } = useCollection(trainersQuery);
  const { data: students } = useCollection(studentsQuery);

  const activeStudents = useMemo(() => students?.filter(s => s.status !== 'blocked') || [], [students]);
  const expiredStudents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return students?.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < today) || [];
  }, [students]);

  const stats = [
    { 
      label: 'Professores', 
      value: trainers?.length || 0, 
      icon: GraduationCap, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      href: '/admin/trainers'
    },
    { 
      label: 'Alunos Ativos', 
      value: activeStudents.length, 
      icon: Users, 
      color: 'text-white', 
      bg: 'bg-white/5',
      href: '/admin/students'
    },
    { 
      label: 'Inadimplentes', 
      value: expiredStudents.length, 
      icon: CreditCard, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/10',
      href: '/admin/subscriptions'
    },
    { 
      label: 'Novas Ações', 
      value: students?.length || 0, 
      icon: Activity, 
      color: 'text-white', 
      bg: 'bg-white/5',
      href: '/admin/audit'
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Painel Administrador" 
        subtitle="Métricas reais e controle total do sistema de elite." 
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className="rounded-[2rem] border border-white/5 shadow-xl bg-card overflow-hidden hover:border-primary/30 transition-all group active:scale-95">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className={cn("p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white/5 pb-4 px-8 pt-8">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Professores Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 font-black text-[10px] uppercase">
              <Link href="/admin/trainers">Ver Todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-8 pt-6">
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
                <Badge variant="outline" className={cn(
                  "text-[9px] font-black uppercase",
                  trainer.status === 'blocked' ? "border-red-500 text-red-500" : "border-primary/30 text-primary"
                )}>
                  {trainer.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}
                </Badge>
              </div>
            ))}
            {(!trainers || trainers.length === 0) && (
              <p className="text-center py-10 text-[10px] font-black uppercase text-white/20 italic tracking-widest">Nenhum professor registrado</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="bg-white/5 pb-4 px-8 pt-8">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Alertas de Atenção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-8 pt-6">
            {expiredStudents.length > 0 && (
              <Link href="/admin/subscriptions">
                <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl mb-4 group hover:bg-yellow-500/20 transition-all">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-white uppercase">{expiredStudents.length} Alunos com mensalidade vencida</p>
                    <p className="text-[9px] font-bold text-yellow-500/60 uppercase">Clique para regularizar o acesso</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-yellow-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
            
            <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              <Link href="/admin/audit">
                Auditoria de Ações
                <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest justify-between px-6 border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all group">
              <Link href="/admin/settings">
                Configurações do Sistema
                <ArrowRight className="h-4 w-4 text-primary group-hover:text-white" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
