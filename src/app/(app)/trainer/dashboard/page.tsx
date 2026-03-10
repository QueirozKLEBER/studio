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
  Activity,
  Dumbbell,
  TrendingUp,
  CreditCard,
  Loader2,
  Wallet
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
    today.setHours(0, 0, 0, 0);
    return students?.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < today).slice(0, 5) || [];
  }, [students]);

  if (!mounted) return null;

  if (profile?.userType !== 'trainer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-white/40 font-black uppercase text-[10px] tracking-widest">Validando credenciais de professor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão de Atletas" 
          subtitle="Dashboard administrativo de elite e métricas financeiras." 
        />
        <Button asChild className="rounded-2xl h-16 px-10 font-black bg-primary text-white shadow-[0_10px_30px_-5px_rgba(255,0,0,0.4)] hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest">
          <Link href="/trainer/workouts/builder">
            <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> NOVO TREINO
          </Link>
        </Button>
      </div>

      {/* Grid de Métricas Financeiras e de Alunos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/trainer/students?filter=active" className="group">
          <Card className="rounded-[2.5rem] border border-white/5 bg-[#1a1d24] overflow-hidden shadow-xl transition-all group-hover:border-green-500/30">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className="p-5 rounded-2xl bg-green-500/10 text-green-500">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">Alunos Ativos</p>
                <p className="text-3xl font-black text-white mt-1">{isStudentsLoading ? '...' : stats.active}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/trainer/students?filter=blocked" className="group">
          <Card className="rounded-[2.5rem] border border-white/5 bg-[#1a1d24] overflow-hidden shadow-xl transition-all group-hover:border-primary/30">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className="p-5 rounded-2xl bg-primary/10 text-primary">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">Inadimplentes</p>
                <p className="text-3xl font-black text-white mt-1">{isStudentsLoading ? '...' : stats.late}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="rounded-[2.5rem] border border-white/5 bg-[#1a1d24] overflow-hidden shadow-xl">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="p-5 rounded-2xl bg-white/5 text-white">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">Novos no Mês</p>
              <p className="text-3xl font-black text-white mt-1">{isStudentsLoading ? '...' : stats.newThisMonth}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none bg-primary overflow-hidden shadow-2xl shadow-primary/20 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="h-24 w-24" />
          </div>
          <CardContent className="p-8 flex flex-col items-center text-center gap-4 relative z-10">
            <div className="p-5 rounded-2xl bg-white/20 text-white">
              <CreditCard className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.25em]">Receita Bruta</p>
              <p className="text-3xl font-black text-white mt-1">R$ {isStudentsLoading ? '...' : stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alertas Financeiros */}
        <div className="lg:col-span-7">
          <Card className="rounded-[2.5rem] border border-white/5 bg-[#1a1d24] overflow-hidden shadow-2xl h-full">
            <CardHeader className="bg-white/5 p-8 flex flex-row items-center justify-between border-b border-white/5">
              <div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Cobranças Pendentes</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold text-white/20 uppercase mt-1">Regularize o acesso destes alunos para manter o caixa em dia.</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/10 font-black text-[10px] uppercase tracking-widest px-4">
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
                ) : lateStudentsList.length > 0 ? (
                  lateStudentsList.map(student => (
                    <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
                      <div className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
                            {student.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight text-lg">{student.fullName || `${student.firstName} ${student.lastName}`}</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Vencido em {new Date(student.paymentDueDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase">Valor</p>
                            <p className="text-sm font-black text-white tracking-tighter">R$ {Number(student.monthlyFee || 0).toFixed(2)}</p>
                          </div>
                          <ChevronRight className="h-6 w-6 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-24 text-center">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="h-8 w-8 text-white/10" />
                    </div>
                    <p className="text-[11px] font-black uppercase text-white/20 italic tracking-widest">Nenhum aluno com pagamento atrasado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atalhos de Gestão */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-[#1a1d24] overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Ferramentas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Button asChild variant="outline" className="w-full h-20 rounded-[1.8rem] border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all justify-between px-8 group bg-white/[0.02]">
                <Link href="/trainer/workouts/builder" className="flex items-center gap-5 w-full">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase text-white tracking-widest">Construtor de Treinos</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase mt-1">Montar novas planilhas de elite</p>
                  </div>
                  <Plus className="h-5 w-5 ml-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full h-20 rounded-[1.8rem] border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all justify-between px-8 group bg-white/[0.02]">
                <Link href="/profile" className="flex items-center gap-5 w-full">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase text-white tracking-widest">Configurar Minha Chave PIX</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase mt-1">Dados reais para recebimento</p>
                  </div>
                  <Plus className="h-5 w-5 ml-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-white/[0.05] to-transparent p-1">
            <div className="bg-[#1a1d24] rounded-[2.4rem] p-8">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-4">Dica do Sistema</h4>
              <p className="text-xs text-white/40 leading-relaxed font-bold italic">
                "Mantenha os perfis dos seus alunos sempre atualizados para que o sistema de auto-bloqueio funcione com precisão."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
