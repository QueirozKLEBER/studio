
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { 
  Users, 
  AlertTriangle, 
  Plus, 
  ChevronRight,
  DollarSign,
  Activity,
  Dumbbell,
  Clock,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TrainerDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca todos os alunos vinculados a este professor
  const studentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users'), where('trainerId', '==', user.uid));
  }, [db, user]);

  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  // Cálculos de métricas reais
  const stats = useMemo(() => {
    if (!students) return { active: 0, late: 0, blocked: 0, revenue: 0, newThisMonth: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return students.reduce((acc, s) => {
      const isBlocked = s.status === 'blocked';
      const isLate = s.paymentDueDate && new Date(s.paymentDueDate) < today;
      const isNew = s.dateJoined && new Date(s.dateJoined) >= firstDayMonth;

      if (isBlocked) acc.blocked++;
      else if (isLate) acc.late++;
      else acc.active++;
      
      if (s.monthlyFee) acc.revenue += Number(s.monthlyFee);
      if (isNew) acc.newThisMonth++;
      
      return acc;
    }, { active: 0, late: 0, blocked: 0, revenue: 0, newThisMonth: 0 });
  }, [students]);

  // Lista de alunos inadimplentes para exibição rápida
  const lateStudentsList = useMemo(() => {
    const today = new Date();
    return students?.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < today).slice(0, 5) || [];
  }, [students]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão de Atletas" 
          subtitle="Dashboard administrativo de elite e métricas financeiras." 
        />
        <div className="flex gap-2">
          <Button asChild className="rounded-2xl h-14 px-8 font-black bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
            <Link href="/trainer/workouts/builder">
              <Plus className="mr-2 h-5 w-5" /> NOVO TREINO
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid de Métricas Financeiras e de Alunos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Alunos Ativos</p>
              <p className="text-2xl font-black text-white mt-1">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-primary/10">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Inadimplentes</p>
              <p className="text-2xl font-black text-white mt-1">{stats.late}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Novos no Mês</p>
              <p className="text-2xl font-black text-white mt-1">{stats.newThisMonth}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-primary overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-white/20">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">Receita Bruta</p>
              <p className="text-2xl font-black text-white mt-1">R$ {stats.revenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alertas Financeiros */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Cobranças Pendentes
                </CardTitle>
                <CardDescription className="text-[10px] font-bold text-white/40 uppercase">Regularize o acesso destes alunos.</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary hover:text-primary/80 font-black text-[10px] uppercase">
                <Link href="/trainer/students">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {isStudentsLoading ? (
                  <div className="p-8 text-center"><Activity className="animate-spin h-6 w-6 mx-auto opacity-20" /></div>
                ) : lateStudentsList.length > 0 ? (
                  lateStudentsList.map(student => (
                    <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
                      <div className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg">
                            {student.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight">{student.fullName}</p>
                            <p className="text-[10px] font-bold text-primary uppercase">Vencido em {new Date(student.paymentDueDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-12 text-center text-[10px] font-black uppercase text-white/20 italic tracking-widest">
                    Nenhum aluno com pagamento atrasado.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atalhos de Gestão */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-6 border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase text-white">Ferramentas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-primary hover:text-white transition-all justify-between px-6 group">
                <Link href="/trainer/workouts/builder" className="flex items-center gap-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-white/20">
                    <Dumbbell className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-white">Construtor de Treinos</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase">Montar novas planilhas</p>
                  </div>
                  <Plus className="h-4 w-4 ml-auto opacity-20" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-primary hover:text-white transition-all justify-between px-6 group">
                <Link href="/profile" className="flex items-center gap-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-white/20">
                    <DollarSign className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-white">Configurar Minha Chave PIX</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase">Dados para recebimento</p>
                  </div>
                  <Plus className="h-4 w-4 ml-auto opacity-20" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
