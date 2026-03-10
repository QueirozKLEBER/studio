'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  ChevronRight,
  DollarSign,
  Activity,
  Dumbbell
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

  // Cálculos de métricas reais baseados na lista de alunos
  const stats = useMemo(() => {
    if (!students) return { active: 0, pending: 0, blocked: 0, revenue: 0, expired: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return students.reduce((acc, s) => {
      if (s.status === 'active') acc.active++;
      if (s.status === 'pending') acc.pending++;
      if (s.status === 'blocked') acc.blocked++;
      
      // Receita baseada no monthlyFee cadastrado no perfil do aluno
      if (s.monthlyFee) acc.revenue += Number(s.monthlyFee);
      
      // Verifica se a mensalidade está vencida
      if (s.paymentDueDate && new Date(s.paymentDueDate) < today) {
        acc.expired++;
      }
      
      return acc;
    }, { active: 0, pending: 0, blocked: 0, revenue: 0, expired: 0 });
  }, [students]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Painel de Gestão" 
          subtitle="Controle técnico e financeiro dos seus atletas de elite." 
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
            <div className="p-4 rounded-2xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Alunos Ativos</p>
              <p className="text-xl font-black text-white mt-1">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Vencidos</p>
              <p className="text-xl font-black text-white mt-1">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-green-500/10">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Receita Estimada</p>
              <p className="text-xl font-black text-white mt-1">R$ {stats.revenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Bloqueados</p>
              <p className="text-xl font-black text-white mt-1">{stats.blocked}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de Alunos Recentes */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Meus Atletas</CardTitle>
                <CardDescription className="text-[10px] font-bold text-white/40 uppercase">Acompanhamento de performance.</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary hover:text-primary/80 font-black text-[10px] uppercase">
                <Link href="/trainer/students">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {isStudentsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {students && students.length > 0 ? (
                    students.slice(0, 5).map(student => (
                      <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg">
                              {student.firstName?.[0]}
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{student.firstName} {student.lastName}</p>
                              <div className="flex gap-2 items-center mt-1">
                                <Badge variant="outline" className={cn(
                                  "text-[7px] font-black uppercase px-2",
                                  student.status === 'blocked' ? "border-red-500 text-red-500" : "border-green-500/30 text-green-500"
                                )}>
                                  {student.status?.toUpperCase() || 'ATIVO'}
                                </Badge>
                                {student.paymentDueDate && new Date(student.paymentDueDate) < new Date() && (
                                  <Badge className="bg-primary text-white text-[7px] font-black uppercase px-2">VENCIDO</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-[10px] font-black uppercase text-white/20 italic tracking-widest">Nenhum aluno vinculado.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Atalhos Rápidos */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-6 border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase text-white">Ferramentas de Elite</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-primary hover:text-white transition-all justify-between px-6 group">
                <Link href="/trainer/workouts/builder" className="flex items-center gap-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-white/20">
                    <Dumbbell className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-white">Montador de Treinos</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase">Criar novas planilhas</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-20" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-primary hover:text-white transition-all justify-between px-6 group">
                <Link href="/profile" className="flex items-center gap-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-white/20">
                    <DollarSign className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-white">Configurar PIX</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase">Receber mensalidades</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-20" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
