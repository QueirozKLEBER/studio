
'use client';

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
import { useMemo } from 'react';

export default function Dashboard() {
  const { user, profile } = useUser();
  const db = useFirestore();

  // Busca o último plano de treino
  const plansQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'trainingPlans'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
  }, [db, user]);

  // Busca o histórico dos últimos 7 dias para o gráfico
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

  // Processa dados reais para o gráfico semanal
  const weeklyData = useMemo(() => {
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
  }, [history]);

  // Verifica se o aluno treinou hoje
  const trainedToday = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    return history?.some(h => h.completedAt?.toDate?.()?.toLocaleDateString('pt-BR') === todayStr);
  }, [history]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-none pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline text-primary">MFIT Personal</h1>
        <p className="text-muted-foreground italic text-sm">"Sua evolução começa hoje, {user?.displayName?.split(' ')[0]}"</p>
      </header>

      {/* Alerta de Treino do Dia */}
      <Card className={cn(
        "rounded-[2rem] border-none shadow-lg overflow-hidden transition-all",
        trainedToday ? "bg-green-50 border-2 border-green-200" : "bg-primary/5 border-2 border-primary/20"
      )}>
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-2xl shadow-sm",
              trainedToday ? "bg-green-500 text-white" : "bg-primary text-white"
            )}>
              {trainedToday ? <CheckCircle2 className="h-6 w-6" /> : <CalendarDays className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-lg">
                {trainedToday ? "Missão Cumprida!" : "Lembrete de Hoje"}
              </h3>
              <p className="text-sm font-medium opacity-70">
                {trainedToday 
                  ? "Você já registrou sua atividade hoje. Continue assim!" 
                  : "Não esqueça de registrar seu treino ou cardio de hoje."}
              </p>
            </div>
          </div>
          {!trainedToday && (
            <Button asChild className="rounded-xl font-bold shadow-md">
              <Link href="/activity">Registrar</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5 w-full">
        {[
          { icon: Dumbbell, label: 'Treinos', href: '/workouts', color: 'bg-blue-100 text-blue-600' },
          { icon: Clock, label: 'Atividades', href: '/activity', color: 'bg-purple-100 text-purple-600' },
          { icon: Utensils, label: 'Dieta', href: '/diet', color: 'bg-orange-100 text-orange-600' },
          { icon: TrendingUp, label: 'Avaliação', href: '/assessment', color: 'bg-green-100 text-green-600' },
          { icon: ChevronRight, label: 'Histórico', href: '/profile', color: 'bg-gray-100 text-gray-600' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-2 group">
            <div className={`p-4 rounded-3xl ${item.color} shadow-sm transition-transform group-active:scale-95 w-full aspect-square flex items-center justify-center`}>
              <item.icon className="h-8 w-8" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Weekly Progress Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              Frequência da Semana
              <Badge variant="secondary" className="bg-primary/10 text-primary">Real Time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            {history && history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} dy={8} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                    content={({active, payload}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 rounded-lg shadow-xl border border-muted text-[10px] font-bold">
                            {payload[0].payload.sessions} Atividade(s)
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                  <Bar dataKey="sessions" radius={[6, 6, 6, 6]} barSize={32}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.sessions > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-30">
                <CalendarDays className="h-12 w-12 mb-2" />
                <p className="text-xs font-bold uppercase">Sem registros nesta semana</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workout of the Day */}
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground p-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Treino Sugerido
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {isPlanLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-8 bg-white/20 rounded-xl w-3/4" />
                <div className="h-4 bg-white/20 rounded-xl w-1/2" />
              </div>
            ) : activePlan ? (
              <>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{activePlan.name}</h3>
                  <p className="text-primary-foreground/80 text-sm mt-2 font-medium italic">
                    Foque na intensidade e técnica hoje.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Badge variant="outline" className="border-white/30 text-white font-bold px-3 py-1">
                    {activePlan.exercises?.length || 0} EXERCÍCIOS
                  </Badge>
                </div>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90 h-14 rounded-3xl font-black text-lg shadow-lg">
                  <Link href={`/workouts/plan/${activePlan.id}`}>
                    INICIAR AGORA
                  </Link>
                </Button>
              </>
            ) : (
              <div className="py-6 text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                <p className="font-bold">Nenhum treino liberado.</p>
                <p className="text-xs opacity-70">Seu professor ainda não enviou seu plano de elite.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
