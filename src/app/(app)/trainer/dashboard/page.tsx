'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  Users, 
  AlertTriangle, 
  Plus, 
  ChevronRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Loader2,
  Dumbbell,
  ShieldBan
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TrainerDashboard() {
  const { user, profile } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca todos os alunos vinculados a este professor
  const studentsQuery = useMemoFirebase(() => {
    if (!user || profile?.userType !== 'trainer') return null;
    return query(collection(db, 'users'), where('trainerId', '==', user.uid));
  }, [db, user, profile]);

  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  // Cálculos de métricas reais
  const stats = useMemo(() => {
    if (!students) return { active: 0, late: 0, blocked: 0, revenue: 0, newThisMonth: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return students.reduce((acc, s) => {
      const isLate = s.paymentDueDate && new Date(s.paymentDueDate) < today;
      const isNew = s.dateJoined && new Date(s.dateJoined) >= firstDayMonth;

      if (s.status === 'blocked') {
        acc.blocked++;
      } else if (isLate) {
        acc.late++;
      } else if (s.status === 'active') {
        acc.active++;
      }
      
      if (s.monthlyFee) acc.revenue += Number(s.monthlyFee);
      if (isNew) acc.newThisMonth++;
      
      return acc;
    }, { active: 0, late: 0, blocked: 0, revenue: 0, newThisMonth: 0 });
  }, [students]);

  if (!mounted) return null;

  if (profile?.userType !== 'trainer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-white/40 font-black uppercase text-[10px] tracking-widest text-center">
          CARREGANDO PAINEL TÉCNICO...
        </p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Alunos Ativos', 
      value: stats.active, 
      icon: Users, 
      color: 'text-white', 
      bg: 'bg-white/5',
      href: '/trainer/students?status=active'
    },
    { 
      label: 'Inadimplentes', 
      value: stats.late, 
      icon: AlertTriangle, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      href: '/trainer/students?status=late'
    },
    { 
      label: 'Bloqueados', 
      value: stats.blocked, 
      icon: ShieldBan, 
      color: 'text-white/40', 
      bg: 'bg-black/20',
      href: '/trainer/students?status=blocked'
    },
    { 
      label: 'Faturamento', 
      value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`, 
      icon: DollarSign, 
      color: 'text-white', 
      bg: 'bg-primary shadow-lg shadow-primary/20',
      href: '/trainer/students'
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Painel de Controle" 
          subtitle={`Bem-vindo, Prof. ${profile?.firstName}. Gerencie seus atletas de elite.`} 
        />
        <Button asChild className="rounded-2xl h-16 px-10 font-black bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest">
          <Link href="/trainer/workouts/builder">
            <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> NOVO TREINO
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className={cn("rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl transition-all hover:border-primary/30 active:scale-95", stat.bg)}>
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <stat.icon className={cn("h-8 w-8", stat.color)} />
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{isStudentsLoading ? '...' : stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl h-full">
            <CardHeader className="bg-white/5 p-8 flex flex-row items-center justify-between border-b border-white/5">
              <div>
                <CardTitle className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Alertas de Vencimento
                </CardTitle>
                <CardDescription className="text-[10px] font-bold text-white/20 uppercase mt-1">Alunos com pendência financeira.</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/10 font-black text-[10px] uppercase">
                <Link href="/trainer/students">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {isStudentsLoading ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <span className="text-[10px] font-black text-white/20 uppercase">Sincronizando faturas...</span>
                  </div>
                ) : (students?.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < new Date()).length || 0) > 0 ? (
                  students?.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < new Date()).map(student => (
                    <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
                      <div className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
                            {student.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight text-lg">{student.fullName || student.firstName}</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Atraso desde {new Date(student.paymentDueDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-24 text-center">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="h-8 w-8 text-white/10" />
                    </div>
                    <p className="text-[11px] font-black uppercase text-white/20 italic tracking-widest text-center">
                      Nenhuma pendência financeira encontrada.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Button asChild variant="outline" className="w-full h-20 rounded-[1.8rem] border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all justify-between px-8 group bg-white/[0.02]">
                <Link href="/trainer/students" className="flex items-center gap-5 w-full">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase text-white tracking-widest">Meus Atletas</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase mt-1">Gerenciar lista completa</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full h-20 rounded-[1.8rem] border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all justify-between px-8 group bg-white/[0.02]">
                <Link href="/profile" className="flex items-center gap-5 w-full">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase text-white tracking-widest">Configurar PIX</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase mt-1">Receber mensalidades</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}