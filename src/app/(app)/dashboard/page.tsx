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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold font-headline">MFIT Personal</h1>
        <p className="text-muted-foreground italic text-sm">"Sua evolução começa hoje, {user?.displayName?.split(' ')[0]}"</p>
      </header>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {[
          { icon: Dumbbell, label: 'Treinos', href: '/workouts', color: 'bg-blue-100 text-blue-600' },
          { icon: TrendingUp, label: 'Avaliação', href: '/assessment', color: 'bg-green-100 text-green-600' },
          { icon: Sparkles, label: 'Blog', href: '/blog', color: 'bg-orange-100 text-orange-600' },
          { icon: Flame, label: 'Planos', href: '/pricing', color: 'bg-red-100 text-red-600' },
          { icon: Clock, label: 'Histórico', href: '/profile', color: 'bg-purple-100 text-purple-600' },
          { icon: ChevronRight, label: 'Mais', href: '/dashboard', color: 'bg-gray-100 text-gray-600' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-2xl ${item.color} shadow-sm transition-transform active:scale-95`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Progress Chart */}
        <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              Progresso da Semana
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">+12%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} dy={8} />
                <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                <Bar dataKey="volume" radius={[4, 4, 4, 4]} barSize={24}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workout of the Day */}
        <Card className="rounded-3xl border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Treino do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-bold">{dailyWorkout.focus}</h3>
              <p className="text-primary-foreground/80 text-sm mt-1">Foco intenso em volume e técnica.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                {dailyWorkout.exercises.length} Exercícios
              </Badge>
              <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                ~50 min
              </Badge>
            </div>
            <Button asChild className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl font-bold">
              <Link href={`/workouts/${dailyWorkout.muscleId}`}>
                Começar Agora
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Blog Highlight */}
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-lg font-bold font-headline px-1">Dicas do Professor</h2>
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">Como ganhar massa muscular com constância?</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">Descubra os pilares da hipertrofia...</p>
              <Link href="/blog" className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1 block">
                Ler mais
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}