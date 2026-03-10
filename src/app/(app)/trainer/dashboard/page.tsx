'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { 
  Users,
  Dumbbell,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboard() {
  const { profile } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24 px-1">
      <PageHeader 
        title="Painel do Professor" 
        subtitle="Gestão técnica e acompanhamento de atletas de elite." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl hover:border-primary/20 transition-all group">
          <CardHeader className="bg-white/5 p-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black uppercase text-white">Meus Alunos</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Gerencie seus atletas vinculados.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Button asChild className="w-full h-12 rounded-xl bg-white/5 text-white hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]">
              <Link href="/trainer/students">ACESSAR LISTA <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl hover:border-primary/20 transition-all group">
          <CardHeader className="bg-white/5 p-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Dumbbell className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black uppercase text-white">Novo Treino</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Monte planilhas personalizadas.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Button asChild className="w-full h-12 rounded-xl bg-white/5 text-white hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]">
              <Link href="/trainer/workouts/builder">ABRIR MONTADOR <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border border-white/5 bg-primary text-white overflow-hidden shadow-2xl group">
          <CardHeader className="p-8">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:rotate-12 transition-transform">
              <TrendingUp className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-black uppercase">Performance</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-white/60 tracking-widest">Analise a evolução da equipe.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest">Sistema de Elite Ativo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[3rem] border-dashed border-2 border-white/5 bg-transparent p-12 text-center flex flex-col items-center gap-6 opacity-40">
        <div className="p-6 bg-card rounded-full">
          <Users className="h-16 w-16 text-white/20" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Bem-vindo, Prof. {profile?.firstName}</h3>
          <p className="text-white/40 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-widest leading-relaxed">
            Utilize os cartões acima para gerenciar seus alunos e montar treinos de alta performance.
          </p>
        </div>
      </Card>
    </div>
  );
}
