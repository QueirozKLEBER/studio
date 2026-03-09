
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dumbbell, Activity, TrendingUp, ArrowLeft, Utensils, Zap, Flame, Clock, Settings, CheckCircle2, History, CreditCard, Calendar, AlertTriangle, Timer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import Link from 'next/link';

function StudentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useUser();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const studentRef = useMemoFirebase(() => id ? doc(db, 'users', id) : null, [db, id]);
  const historyQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc')) : null, [db, id]);
  const plansQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'trainingPlans'), orderBy('createdAt', 'desc')) : null, [db, id]);
  const dietsQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'dietSuggestions'), orderBy('createdAt', 'desc')) : null, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: history } = useCollection(historyQuery);
  const { data: plans } = useCollection(plansQuery);
  const { data: diets } = useCollection(dietsQuery);

  const totalTrainingMinutes = useMemo(() => {
    if (!history) return 0;
    return history.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  }, [history]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentRef) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      height: formData.get('height') as string,
      weight: formData.get('weight') as string,
      paymentDueDate: formData.get('paymentDueDate') as string,
    };

    setIsUpdating(true);
    try {
      await updateDoc(studentRef, data);
      toast({ title: "Perfil atualizado" });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao atualizar" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentRef) return;
    const formData = new FormData(e.currentTarget);
    const date = formData.get('paymentDueDate') as string;

    setIsUpdating(true);
    try {
      await updateDoc(studentRef, { paymentDueDate: date });
      toast({ title: "Pagamento atualizado", description: "Próximo vencimento definido." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddDiet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      createdAt: serverTimestamp(),
    };

    setIsUpdating(true);
    try {
      await addDoc(collection(db, 'users', id, 'dietSuggestions'), data);
      toast({ title: "Dieta adicionada" });
      setIsDietModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-background h-screen" />;
  if (!student) return <div className="p-8 text-center py-20 text-white font-black uppercase">Aluno não encontrado.</div>;

  const imc = student.weight && student.height 
    ? (parseFloat(student.weight) / ((parseFloat(student.height)/100)**2)).toFixed(1)
    : '--';

  const isExpired = student.paymentDueDate && new Date(student.paymentDueDate) < new Date();

  return (
    <div className="flex flex-col gap-8 w-full pb-20 max-w-6xl mx-auto px-1">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader title={`${student.firstName} ${student.lastName}`} subtitle="ANÁLISE DE PERFORMANCE E GESTÃO." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl relative overflow-hidden flex flex-col min-h-[340px]">
          <div className="absolute top-6 right-6 z-10">
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white/20 hover:text-primary hover:bg-primary/10 h-10 w-10">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] max-w-md bg-card border-white/10 text-white">
                <DialogHeader><DialogTitle className="font-black uppercase tracking-tight">Editar Perfil</DialogTitle></DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Nome</Label>
                      <Input name="firstName" defaultValue={student.firstName} className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Sobrenome</Label>
                      <Input name="lastName" defaultValue={student.lastName} className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Altura (cm)</Label>
                      <Input name="height" type="number" defaultValue={student.height || ''} className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40">Peso (kg)</Label>
                      <Input name="weight" type="number" defaultValue={student.weight || ''} className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40">Vencimento Mensalidade</Label>
                    <Input name="paymentDueDate" type="date" defaultValue={student.paymentDueDate || ''} className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                  </div>
                  <DialogFooter><Button type="submit" className="w-full rounded-2xl h-14 bg-primary font-black uppercase shadow-lg shadow-primary/20" disabled={isUpdating}>Salvar Alterações</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center flex-1 text-center">
            <div className="h-32 w-32 rounded-[2.5rem] bg-primary/5 border-4 border-primary/20 flex items-center justify-center text-5xl font-black text-primary mb-6 shadow-2xl">
              {student.firstName[0]}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{student.firstName} {student.lastName}</h3>
            <Badge className="mt-4 bg-primary text-white font-black text-[9px] tracking-[0.2em] uppercase px-5 py-1.5 rounded-full">ALUNO ELITE</Badge>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl flex flex-col min-h-[340px]">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Tempo de Treino Total</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center flex-1">
            <div className="text-center space-y-1">
              <span className="text-7xl font-black text-primary tracking-tighter block">{totalTrainingMinutes}</span>
              <p className="text-[10px] font-black uppercase text-white/40 italic tracking-[0.2em]">MINUTOS INVESTIDOS</p>
            </div>
            <div className="mt-10 w-full">
              <div className="flex items-center justify-between bg-white/5 p-5 rounded-[1.8rem] border border-white/5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">SESSÕES HOJE</span>
                <Badge variant="outline" className="bg-primary/10 border-none text-primary font-black text-[10px]">
                  {history?.filter(h => h.completedAt?.toDate().toDateString() === new Date().toDateString()).length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl flex flex-col min-h-[340px]">
          <CardContent className="p-8 flex flex-col justify-center gap-4 flex-1 h-full">
            <Button asChild className="w-full h-20 rounded-[1.8rem] font-black text-lg bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-tight transition-all active:scale-95 group">
              <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                <div className="flex items-center justify-center gap-3">
                  <Dumbbell className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                  <span>MONTAR TREINO</span>
                </div>
              </Link>
            </Button>
            
            <Dialog open={isDietModalOpen} onOpenChange={setIsDietModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-sm border-2 border-white/10 text-white hover:bg-white/5 uppercase tracking-widest transition-all group">
                  <Utensils className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  SUGERIR DIETA
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] max-w-lg bg-card border-white/10 text-white">
                <DialogHeader><DialogTitle className="font-black uppercase tracking-tight">Nova Orientação Alimentar</DialogTitle></DialogHeader>
                <form onSubmit={handleAddDiet} className="space-y-4 py-4">
                  <Input name="title" placeholder="Título (ex: Cutting Fase 1)" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                  <Textarea name="description" placeholder="Descreva as refeições e horários..." required className="rounded-xl bg-white/5 border-none min-h-[200px] font-medium" />
                  <Button type="submit" className="w-full rounded-2xl h-14 bg-primary font-black uppercase shadow-xl shadow-primary/20" disabled={isUpdating}>ENVIAR AGORA</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="mt-4">
        <TabsList className="bg-white/5 p-1.5 rounded-2xl h-16 w-full md:w-auto border border-white/5 gap-1 shadow-inner overflow-x-auto no-scrollbar">
          <TabsTrigger value="workouts" className="px-8 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Planilhas</TabsTrigger>
          <TabsTrigger value="report" className="px-8 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Relatório</TabsTrigger>
          <TabsTrigger value="diets" className="px-8 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Dieta</TabsTrigger>
          <TabsTrigger value="billing" className="px-8 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <Card key={plan.id} className="rounded-[2.5rem] p-8 bg-card border border-white/5 shadow-xl flex flex-col group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-14 w-14 bg-primary/10 rounded-[1.2rem] flex items-center justify-center text-primary shadow-inner border border-primary/10">
                    <Dumbbell className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="bg-white/5 text-white/40 font-black text-[8px] uppercase border-none tracking-widest px-3 py-1">
                      {plan.exercises?.length || 0} EXERCÍCIOS
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase text-[7px] px-2 py-0.5">
                      {plan.difficulty || 'INTERMEDIARIO'}
                    </Badge>
                  </div>
                </div>
                <h4 className="font-black text-2xl uppercase tracking-tight text-white mb-2 leading-tight">{plan.name}</h4>
                <div className="flex items-center gap-2 mb-6">
                   <Badge variant="outline" className="border-white/10 text-white/40 font-black text-[8px] uppercase">{plan.workoutType || 'Geral'}</Badge>
                   {plan.allowPdfDownload && <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[7px] uppercase">PDF LIBERADO</Badge>}
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3 text-primary" />
                  LIBERADO EM {plan.createdAt?.toDate().toLocaleDateString('pt-BR')}
                </p>
                <div className="mt-10">
                  <Button asChild variant="outline" className="w-full rounded-2xl h-14 border-2 border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:border-primary transition-all shadow-lg">
                    <Link href={`/trainer/workouts/builder?studentId=${id}&planId=${plan.id}`}>EDITAR PLANILHA</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-8">
          <Card className="rounded-[3rem] p-8 bg-card border border-white/5 shadow-2xl overflow-hidden">
            <ScrollArea className="h-[550px] pr-4">
              <div className="flex flex-col gap-4">
                {history?.map((entry, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all group">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105", 
                      entry.type === 'manual' ? "bg-primary text-white" : "bg-white/10 text-primary"
                    )}>
                      {entry.activityType === 'cardio' ? <Flame className="h-8 w-8" /> : <Dumbbell className="h-8 w-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xl text-white uppercase tracking-tight truncate">{entry.planName}</p>
                      <div className="flex items-center gap-5 mt-2">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                          <History className="h-3.5 w-3.5 text-primary" />
                          {entry.completedAt?.toDate().toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic bg-primary/10 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                          <Timer className="h-3 w-3" />
                          {entry.duration || 0} MIN
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden sm:flex border-primary/20 text-primary font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full">CONCLUÍDO</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-8">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
            <CardHeader className="bg-white/5 p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                Controle de Mensalidades
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-widest">
                Defina a data de vencimento. O sistema bloqueará o acesso automaticamente após esta data.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <form onSubmit={handleUpdatePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-primary" /> Próximo Vencimento
                    </Label>
                    <Input 
                      name="paymentDueDate" 
                      type="date" 
                      defaultValue={student.paymentDueDate || ''} 
                      className="rounded-xl h-12 bg-white/5 border-none text-white font-bold" 
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-black uppercase shadow-lg shadow-primary/20" disabled={isUpdating}>
                    ATUALIZAR VENCIMENTO
                  </Button>
                </form>

                <div className={cn(
                  "p-8 rounded-[2rem] border flex flex-col items-center justify-center text-center gap-4",
                  isExpired ? "bg-red-500/5 border-red-500/20" : "bg-green-500/5 border-green-500/20"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shadow-2xl",
                    isExpired ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  )}>
                    {isExpired ? <AlertTriangle className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Status de Acesso</p>
                    <p className={cn("text-2xl font-black uppercase tracking-tighter mt-1", isExpired ? "text-red-500" : "text-green-500")}>
                      {isExpired ? 'ACESSO BLOQUEADO' : 'ACESSO LIBERADO'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diets" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diets?.map((diet) => (
              <Card key={diet.id} className="rounded-[2.5rem] p-8 bg-card border border-white/5 shadow-xl hover:border-primary/30 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner border border-primary/10">
                    <Utensils className="h-7 w-7" />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{diet.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                </div>
                <h4 className="font-black text-2xl text-white uppercase tracking-tight mb-6 leading-tight">{diet.title}</h4>
                <div className="bg-black/20 p-6 rounded-[1.8rem] border border-white/5 flex-1 shadow-inner">
                  <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed italic font-medium">{diet.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDetailsPage() {
  return <Suspense fallback={<div className="p-8 animate-pulse bg-background h-screen" />}><StudentDetailsContent /></Suspense>;
}
