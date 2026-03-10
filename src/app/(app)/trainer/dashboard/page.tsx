'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { 
  Calendar, 
  Plus,
  Loader2,
  Trash2,
  Clock,
  Users,
  Video
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function TrainerDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // QUERY DA AGENDA - CAMINHO EXATO AUTORIZADO PELAS RULES
  const appointmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'appointments'),
      where('date', '==', todayStr),
      orderBy('time', 'asc')
    );
  }, [db, user, todayStr]);

  const { data: appointments, isLoading: isAgendaLoading } = useCollection(appointmentsQuery);

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
      toast({ title: "Agendamento Criado!" });
      setIsAppointmentModalOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro ao salvar" });
    } finally {
      setIsAddingAppointment(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'appointments', id));
      toast({ title: "Removido" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao remover" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-24 px-1">
      <PageHeader 
        title="Agenda de Treinos" 
        subtitle="Confira seus compromissos técnicos para hoje." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/5 p-6 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase text-white flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                Compromissos de Hoje ({new Date().toLocaleDateString('pt-BR')})
              </CardTitle>
              <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] bg-card border-white/10 text-white">
                  <DialogHeader><DialogTitle className="font-black uppercase tracking-tight">Novo Agendamento</DialogTitle></DialogHeader>
                  <form onSubmit={handleAddAppointment} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Título</Label>
                      <Input name="title" placeholder="Ex: Treino Personal" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Aluno</Label>
                      <Input name="studentName" placeholder="Nome do Aluno" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="time" type="time" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                      <Select name="type" defaultValue="presencial">
                        <SelectTrigger className="rounded-xl bg-white/5 border-none h-12 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl bg-card border-white/10 text-white">
                          <SelectItem value="presencial">PRESENCIAL</SelectItem>
                          <SelectItem value="online">ONLINE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter><Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-black uppercase" disabled={isAddingAppointment}>{isAddingAppointment ? <Loader2 className="animate-spin" /> : 'SALVAR'}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isAgendaLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)
                ) : appointments && appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border-l-4 border-primary group">
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <p className="text-xs font-black text-white">{apt.time}</p>
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase">{apt.title}</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
                            {apt.studentName} {apt.type === 'online' ? <Video className="h-2 w-2" /> : <Users className="h-2 w-2" />}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAppointment(apt.id)} className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Nenhum compromisso agendado para hoje.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}