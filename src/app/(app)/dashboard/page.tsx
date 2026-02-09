'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useUser } from '@/firebase';
import { dailyWorkout } from '@/lib/placeholder-data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from 'recharts';

const weeklyData = [
  { day: 'S', volume: 150, color: 'hsl(var(--primary))' },
  { day: 'T', volume: 220, color: 'hsl(var(--primary))' },
  { day: 'Q', volume: 180, color: 'hsl(var(--primary))' },
  { day: 'Q', volume: 290, color: 'hsl(var(--primary))' },
  { day: 'S', volume: 210, color: 'hsl(var(--primary))' },
  { day: 'S', volume: 260, color: 'hsl(var(--secondary))' },
  { day: 'D', volume: 0, color: 'hsl(var(--muted))' },
];

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-6 w-full">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline text-primary">MFIT Personal</h1>
        <p className="text-muted-foreground italic text-sm">"Sua evolução começa hoje, {user?.displayName?.split(' ')[0]}"</p>
      </header>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 w-full">
        {[
          { icon: Dumbbell, label: 'Treinos', href: '/workouts', color: 'bg-blue-100 text-blue-600' },
          { icon: TrendingUp, label: 'Avaliação', href: '/assessment', color: 'bg-green-100 text-green-600' },
          { icon: Sparkles, label: 'Blog', href: '/blog', color: 'bg-orange-100 text-orange-600' },
          { icon: Flame, label: 'Planos', href: '/pricing', color: 'bg-red-100 text-red-600' },
          { icon: Clock, label: 'Histórico', href: '/profile', color: 'bg-purple-100 text-purple-600' },
          { icon: ChevronRight, label: 'Mais', href: '/dashboard', color: 'bg-gray-100 text-gray-600' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-2">
            <div className={`p-4 rounded-3xl ${item.color} shadow-sm transition-transform active:scale-95 w-full aspect-square flex items-center justify-center`}>
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
              Progresso da Semana
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">+12%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} dy={8} />
                <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                <Bar dataKey="volume" radius={[6, 6, 6, 6]} barSize={32}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workout of the Day */}
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground p-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Treino do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <h3 className="text-3xl font-black">{dailyWorkout.focus}</h3>
              <p className="text-primary-foreground/80 text-sm mt-2 font-medium">Foco intenso em volume e técnica para resultados máximos.</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="border-white/30 text-white font-bold px-3 py-1">
                {dailyWorkout.exercises.length} Exercícios
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white font-bold px-3 py-1">
                ~50 min
              </Badge>
            </div>
            <Button asChild className="w-full bg-white text-primary hover:bg-white/90 h-14 rounded-3xl font-black text-lg shadow-lg">
              <Link href={`/workouts/${dailyWorkout.muscleId}`}>
                COMEÇAR TREINO
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Blog Highlight */}
      <div className="flex flex-col gap-4 mb-10 w-full">
        <h2 className="text-xl font-bold font-headline px-1">Dicas do Professor</h2>
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-6 p-6">
            <div className="h-20 w-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-inner">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg truncate">Como ganhar massa muscular com constância?</h4>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">Descubra os pilares da hipertrofia real e duradoura...</p>
              <Link href="/blog" className="text-xs text-primary font-black uppercase tracking-widest mt-2 block hover:underline">
                Ler Matéria Completa
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
