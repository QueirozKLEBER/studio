
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { 
  Users, 
  Dumbbell, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Video,
  Loader2,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function TrainerDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Query para buscar todos os alunos vinculados a este professor
  const studentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users'), where('trainerId', '==', user.uid));
  }, [db, user]);

  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  // 2. Query para a Agenda de hoje do PROFESSOR (Subcoleção do próprio UID)
  const todayStr = new Date().toISOString().split('T')[0];
  const agendaQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'appointments'),
      where('date', '==', todayStr),
      orderBy('time', 'asc')
    );
  }, [db, user, todayStr]);

  const { data: appointments, isLoading: isAgendaLoading } = useCollection(agendaQuery);

  // Cálculos de métricas reais
  const stats = useMemo(() => {
    if (!students) return { active: 0, pending: 0, blocked: 0, revenue: 0, expired: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return students.reduce((acc, s) => {
      if (s.status === 'active') acc.active++;
      if (s.status === 'pending') acc.pending++;
      if (s.status === 'blocked') acc.blocked++;
      
      if (s.monthlyFee) acc.revenue += Number(s.monthlyFee);
      
      if (s.paymentDueDate && new Date(s.paymentDueDate) < today) {
        acc.expired++;
      }
      
      return acc;
    }, { active: 0, pending: 0, blocked: 0, revenue: 0, expired: 0 });
  }, [students]);

  const handleAddAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    setIsAddingAppointment(true);
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'appointments'), {
        title: formData.get('title'),
        studentName: formData.get('studentName'),
        time: formData.get('time'),
        date: todayStr,
        type: formData.get('type'),
        createdAt: serverTimestamp()
      });
      
      toast({ title: "Compromisso Salvo! 📅" });
      setIsAppointmentModalOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro ao salvar na agenda" });
    } finally {
      setIsAddingAppointment(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Painel de Controle" 
          subtitle="Gestão técnica e financeira de alunos de elite." 
        />
        <div className="flex gap-2">
          <Button asChild className="rounded-2xl h-14 px-8 font-black bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
            <Link href="/trainer/workouts/builder">
              <Plus className="mr-2 h-5 w-5" /> NOVO TREINO
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Alunos Ativos', value: stats.active, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Inadimplentes', value: stats.expired, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Receita Mensal', value: `R$ ${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Acessos Bloqueados', value: stats.blocked, icon: TrendingUp, color: 'text-white', bg: 'bg-white/5' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border border-white/5 bg-card overflow-hidden shadow-xl">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista de Alunos Recentes */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl h-full">
            <CardHeader className="bg-white/5 p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Meus Atletas</CardTitle>
                <CardDescription className="text-[10px] font-bold text-white/40 uppercase">Acompanhamento em tempo real.</CardDescription>
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
                              <Badge variant="outline" className={cn(
                                "text-[8px] font-black uppercase px-2 mt-1",
                                student.paymentDueDate && new Date(student.paymentDueDate) < new Date() 
                                  ? "border-red-500 text-red-500" 
                                  : "border-green-500/30 text-green-500"
                              )}>
                                {student.paymentDueDate && new Date(student.paymentDueDate) < new Date() ? 'VENCIDO' : 'EM DIA'}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-[10px] font-black uppercase text-white/20 italic tracking-widest">Nenhum aluno vinculado ainda.</p>
                      <Button asChild variant="link" className="text-primary font-black uppercase text-[10px] mt-2">
                        <Link href="/trainer/students">Vincular Primeiro Aluno</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agenda do Professor */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-6 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase text-white flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                Minha Agenda
              </CardTitle>
              <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] bg-card border-white/10 text-white">
                  <DialogHeader><DialogTitle className="font-black uppercase tracking-tight">Novo Agendamento</DialogTitle></DialogHeader>
                  <form onSubmit={handleAddAppointment} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Título do Evento</Label>
                      <Input name="title" placeholder="Ex: Avaliação Física" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Nome do Aluno</Label>
                      <Input name="studentName" placeholder="Ex: João Silva" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-black text-[10px] uppercase text-white/40">Horário</Label>
                        <Input name="time" type="time" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black text-[10px] uppercase text-white/40">Tipo</Label>
                        <Select name="type" defaultValue="presencial">
                          <SelectTrigger className="rounded-xl bg-white/5 border-none h-12 font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl bg-card border-white/10 text-white">
                            <SelectItem value="presencial">PRESENCIAL</SelectItem>
                            <SelectItem value="online">ONLINE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter><Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-black uppercase shadow-lg shadow-primary/20" disabled={isAddingAppointment}>{isAddingAppointment ? <Loader2 className="animate-spin" /> : 'SALVAR COMPROMISSO'}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              {isAgendaLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border-l-4 border-primary group">
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-white uppercase">{apt.time}</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase">HOJE</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase">{apt.title}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase">{apt.studentName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-[9px] font-black uppercase tracking-widest">Agenda livre para hoje</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
