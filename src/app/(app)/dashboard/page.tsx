'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Dumbbell, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  AlertCircle,
  Utensils,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const plansQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'trainingPlans'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
  }, [db, user]);

  const historyQuery = useMemoFirebase(() => {
    if (!user) return null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return query(
      collection(db, 'users', user.uid, 'workoutHistory'),
      where('completedAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('completedAt', 'asc')
    );
  }, [db, user]);

  const { data: latestPlans, isLoading: isPlanLoading } = useCollection(plansQuery);
  const { data: history } = useCollection(historyQuery);

  const activePlan = latestPlans && latestPlans.length > 0 ? latestPlans[0] : null;

  const weeklyData = useMemo(() => {
    if (!mounted) return [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toLocaleDateString('pt-BR');
      
      const count = history?.filter(h => {
        const hDate = h.completedAt?.toDate?.()?.toLocaleDateString('pt-BR');
        return hDate === dateStr;
      }).length || 0;

      result.push({
        day: dayName,
        sessions: count,
        fullDate: dateStr
      });
    }
    return result;
  }, [history, mounted]);

  const trainedToday = useMemo(() => {
    if (!mounted || !history) return false;
    const todayStr = new Date().toLocaleDateString('pt-BR');
    return history.some(h => h.completedAt?.toDate?.()?.toLocaleDateString('pt-BR') === todayStr);
  }, [history, mounted]);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-none pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black font-headline text-slate-900 uppercase tracking-tight">TreinusFit <span className="text-primary">Personal</span></h1>
        <p className="text-muted-foreground font-bold italic text-xs uppercase tracking-widest">"Sua evolução começa hoje, {user?.displayName?.split(' ')[0]}"</p>
      </header>

      {/* Alerta de Treino do Dia */}
      <Card className={cn(
        "rounded-[2.5rem] border-none shadow-sm overflow-hidden transition-all bg-white",
        trainedToday ? "border-l-8 border-green-500" : "border-l-8 border-primary"
      )}>
        <CardContent className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={cn(
              "p-4 rounded-2xl shadow-sm",
              trainedToday ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
            )}>
              {trainedToday ? <CheckCircle2 className="h-8 w-8" /> : <CalendarDays className="h-8 w-8" />}
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-xl">
                {trainedToday ? "Missão Cumprida!" : "Pronto para Treinar?"}
              </h3>
              <p className="text-sm font-bold text-muted-foreground mt-1">
                {trainedToday 
                  ? "Você já registrou sua atividade hoje. Excelente!" 
                  : "Seu professor atualizou sua planilha. Vamos lá!"}
              </p>
            </div>
          </div>
          {!trainedToday && (
            <Button asChild className="rounded-2xl h-14 px-8 font-black text-lg shadow-lg bg-primary text-white hover:bg-primary/90 transition-transform active:scale-95">
              <Link href="/activity">REGISTRAR</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-5 w-full">
        {[
          { icon: Dumbbell, label: 'Treinos', href: '/workouts' },
          { icon: Clock, label: 'Atividades', href: '/activity' },
          { icon: Utensils, label: 'Dieta', href: '/diet' },
          { icon: TrendingUp, label: 'Avaliação', href: '/assessment' },
          { icon: ChevronRight, label: 'Histórico', href: '/profile' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-3 group">
            <div className="p-6 rounded-[2rem] shadow-sm bg-white border border-slate-100 transition-all group-active:scale-90 w-full aspect-square flex items-center justify-center hover:bg-primary hover:text-white group-hover:shadow-xl group-hover:shadow-primary/20">
              <item.icon className="h-8 w-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Weekly Progress Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black flex items-center justify-between uppercase tracking-widest text-slate-400">
              Frequência Semanal
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black uppercase text-[10px]">Ativo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            {history && history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} fontWeight="900" dy={8} stroke="#94a3b8" />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                    content={({active, payload}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl text-[10px] font-black text-white uppercase tracking-tighter">
                            {payload[0].payload.sessions} Atividade(s)
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                  <Bar dataKey="sessions" radius={[8, 8, 8, 8]} barSize={24}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.sessions > 0 ? 'hsl(var(--primary))' : '#f1f5f9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-20">
                <CalendarDays className="h-16 w-16 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Sem registros</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workout of the Day */}
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground p-2">
          <CardHeader>
            <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-white/70">
              <Dumbbell className="h-5 w-5" />
              Treino do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 p-8 pt-2">
            {isPlanLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-white/20 rounded-xl w-3/4" />
                <div className="h-4 bg-white/20 rounded-xl w-1/2" />
              </div>
            ) : activePlan ? (
              <>
                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{activePlan.name}</h3>
                  <p className="text-white/80 text-sm mt-4 font-bold italic">
                    Foque na intensidade e técnica perfeita hoje.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Badge variant="outline" className="border-white/40 text-white font-black px-4 py-2 uppercase text-[10px] tracking-widest bg-white/10">
                    {activePlan.exercises?.length || 0} EXERCÍCIOS
                  </Badge>
                </div>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90 h-16 rounded-[1.8rem] font-black text-xl shadow-2xl transition-all active:scale-95">
                  <Link href={`/workouts/plan?id=${activePlan.id}`}>
                    INICIAR AGORA
                  </Link>
                </Button>
              </>
            ) : (
              <div className="py-10 text-center space-y-6">
                <AlertCircle className="h-16 w-16 mx-auto text-white/30" />
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest">Nenhum treino liberado</p>
                  <p className="text-xs font-bold text-white/60">Aguardando atualização do seu professor.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}