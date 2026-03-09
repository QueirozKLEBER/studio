
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { 
  Users, 
  ChevronRight, 
  Search, 
  CreditCard, 
  AlertTriangle, 
  Calendar, 
  Dumbbell, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Loader2,
  Trash2,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function TrainerDashboard() {
  const { profile, user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca todos os alunos
  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);

  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  // Busca agendamentos de hoje
  const todayStr = new Date().toISOString().split('T')[0];
  const appointmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'appointments'),
      where('date', '==', todayStr),
      orderBy('time', 'asc')
    );
  }, [db, user, todayStr]);

  const { data: appointments, isLoading: isAgendaLoading } = useCollection(appointmentsQuery);

  // Cálculos de Gestão
  const stats = useMemo(() => {
    if (!students) return { total: 0, expired: 0, active: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expired = students.filter(s => s.paymentDueDate && new Date(s.paymentDueDate) < today).length;
    return {
      total: students.length,
      expired: expired,
      active: students.length - expired
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      studentName: formData.get('studentName') as string,
      time: formData.get('time') as string,
      date: todayStr,
      type: formData.get('type') as 'presencial' | 'online',
      createdAt: serverTimestamp(),
    };

    setIsAddingAppointment(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'appointments'), data);
      toast({ title: "Agendamento Criado!", description: "Compromisso salvo na agenda de hoje." });
      setIsAppointmentModalOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro ao salvar", description: "Tente novamente mais tarde." });
    } finally {
      setIsAddingAppointment(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'appointments', id));
      toast({ title: "Removido", description: "Compromisso excluído da agenda." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao remover" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title={`Painel Prof. ${profile?.firstName || '...'}`} 
          subtitle="GESTÃO TÉCNICA E FINANCEIRA DA SUA EQUIPE." 
        />
        <Button asChild className="rounded-2xl h-14 px-8 font-black bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
          <Link href="/trainer/students">
            <Users className="mr-2 h-5 w-5" />
            GERENCIAR ALUNOS
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-[2rem] bg-card border border-white/5 shadow-xl overflow-hidden hover:border-primary/20 transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total Alunos</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] bg-card border border-white/5 shadow-xl overflow-hidden hover:border-primary/20 transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Ativos</p>
              <p className="text-2xl font-black text-white">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] bg-card border border-white/5 shadow-xl overflow-hidden hover:border-primary/20 transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vencidos</p>
              <p className="text-2xl font-black text-white">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] bg-card border border-white/5 shadow-xl overflow-hidden hover:border-primary/20 transition-all">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Trocar Treino</p>
              <p className="text-2xl font-black text-white">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                Localizar Atleta
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Acesso rápido ao histórico e planilhas.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  placeholder="BUSCAR PELO NOME..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-2xl h-14 pl-12 bg-black/20 border-white/5 text-white font-black uppercase text-[10px] tracking-widest focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                {isStudentsLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.slice(0, 5).map((student) => (
                    <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group flex items-center justify-between mb-3">
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
                              {student.paymentDueDate && new Date(student.paymentDueDate) < new Date() ? 'INADIMPLENTE' : 'EM DIA'}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center py-10 text-[10px] font-black uppercase text-white/20 italic tracking-widest">Nenhum aluno encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-6 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase text-white flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                Agenda do Dia
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
                            <SelectItem value="online">ONLINE (MEET)</SelectItem>
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
              <div className="space-y-4">
                {isAgendaLoading ? (
                  [1, 2].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl" />)
                ) : appointments && appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border-l-4 border-primary group">
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-white uppercase">{apt.time}</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase">HOJE</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase">{apt.title}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase flex items-center gap-1">
                            {apt.studentName} • {apt.type === 'online' ? <Video className="h-2 w-2" /> : <Users className="h-2 w-2" />} {apt.type}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAppointment(apt.id)} className="opacity-0 group-hover:opacity-100 h-8 w-8 text-white/20 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                    <p className="text-[9px] font-black uppercase tracking-widest">Nenhum agendamento para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border border-white/5 bg-primary text-white overflow-hidden shadow-2xl p-2">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Alertas Urgentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {stats.expired > 0 ? (
                <Link href="/trainer/students">
                  <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-white" />
                      <p className="text-[10px] font-black uppercase tracking-tight">{stats.expired} MENSALIDADES VENCIDAS</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-50" />
                  </div>
                </Link>
              ) : (
                <div className="p-4 rounded-2xl border border-white/20 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest">Tudo em dia!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
