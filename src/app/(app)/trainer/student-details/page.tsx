'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dumbbell, Activity, TrendingUp, ArrowLeft, Utensils, Zap, Flame, Clock, Settings, CheckCircle2, History } from 'lucide-react';
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

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentRef) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      height: formData.get('height') as string,
      weight: formData.get('weight') as string,
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

  return (
    <div className="flex flex-col gap-6 w-full pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader title={`${student.firstName} ${student.lastName}`} subtitle="Gestão total do aluno." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white/40 hover:text-primary">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-md bg-card border-white/10 text-white">
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
                  <DialogFooter><Button type="submit" className="w-full rounded-2xl h-14 bg-primary font-black uppercase" disabled={isUpdating}>Salvar Alterações</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-28 w-28 rounded-[2.2rem] bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-4xl font-black text-primary mb-4 shadow-xl">
              {student.firstName[0]}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{student.firstName} {student.lastName}</h3>
            <Badge className="mt-2 bg-primary text-white font-black text-[9px] tracking-widest uppercase px-4 py-1">PLANO PERSONAL</Badge>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Evolução Corporal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-6xl font-black text-white tracking-tighter">
                {student.weight && student.height 
                  ? (parseFloat(student.weight) / ((parseFloat(student.height)/100)**2)).toFixed(1)
                  : '--'}
              </span>
              <p className="text-[10px] font-black uppercase text-primary italic mt-1 tracking-widest">IMC Estimado</p>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black text-white/40 uppercase">Status do Aluno</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-none font-black text-[9px] uppercase tracking-widest">ATIVO</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl p-6 flex flex-col gap-4">
          <Button asChild className="w-full h-16 rounded-2xl font-black text-lg bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-tight transition-transform active:scale-95">
            <Link href={`/trainer/workouts/builder?studentId=${id}`}>
              <Dumbbell className="mr-2 h-6 w-6" />
              MONTAR TREINO
            </Link>
          </Button>
          <Dialog open={isDietModalOpen} onOpenChange={setIsDietModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-lg border-2 border-white/10 text-white hover:bg-white/5 uppercase tracking-tight">
                <Utensils className="mr-2 h-6 w-6 text-primary" />
                SUGERIR DIETA
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-lg bg-card border-white/10 text-white">
              <DialogHeader><DialogTitle className="font-black uppercase">Nova Orientação Alimentar</DialogTitle></DialogHeader>
              <form onSubmit={handleAddDiet} className="space-y-4 py-4">
                <Input name="title" placeholder="Título (ex: Cutting Fase 1)" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                <Textarea name="description" placeholder="Descreva as refeições e horários..." required className="rounded-xl bg-white/5 border-none min-h-[200px] font-medium" />
                <Button type="submit" className="w-full rounded-2xl h-14 bg-primary font-black uppercase shadow-xl" disabled={isUpdating}>ENVIAR AGORA</Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="mt-8">
        <TabsList className="bg-white/5 p-1 rounded-2xl h-14 w-full md:w-auto border border-white/5">
          <TabsTrigger value="workouts" className="px-10 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Treinos</TabsTrigger>
          <TabsTrigger value="report" className="px-10 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Relatório</TabsTrigger>
          <TabsTrigger value="diets" className="px-10 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Dieta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <Card key={plan.id} className="rounded-[2.2rem] p-6 bg-card border border-white/5 shadow-xl flex flex-col group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-white/5 text-white/40 font-black text-[10px] uppercase border-none">
                    {plan.exercises?.length || 0} EXERCÍCIOS
                  </Badge>
                </div>
                <h4 className="font-black text-xl uppercase tracking-tight text-white mb-1">{plan.name}</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3 text-primary" />
                  {plan.createdAt?.toDate().toLocaleDateString('pt-BR')}
                </p>
                <div className="mt-8">
                  <Button asChild variant="outline" className="w-full rounded-xl h-12 border-2 border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:border-primary transition-all">
                    <Link href={`/trainer/workouts/builder?studentId=${id}&planId=${plan.id}`}>EDITAR PLANILHA</Link>
                  </Button>
                </div>
              </Card>
            ))}
            {(!plans || plans.length === 0) && (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                <p className="text-white/20 font-black uppercase tracking-widest italic">Nenhum treino planejado</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-8">
          <Card className="rounded-[2.5rem] p-8 bg-card border border-white/5 shadow-2xl overflow-hidden">
            <ScrollArea className="h-[500px] pr-4">
              <div className="flex flex-col gap-4">
                {history?.map((entry, i) => (
                  <div key={i} className="flex items-center gap-6 p-5 bg-white/5 rounded-[1.8rem] border border-white/5 hover:border-primary/20 transition-all">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg", 
                      entry.type === 'manual' ? "bg-primary text-white" : "bg-white/10 text-primary"
                    )}>
                      {entry.activityType === 'cardio' ? <Flame className="h-7 w-7" /> : <Dumbbell className="h-7 w-7" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-lg text-white uppercase tracking-tight truncate">{entry.planName}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1">
                          <History className="h-3 w-3 text-primary" />
                          {entry.completedAt?.toDate().toLocaleDateString('pt-BR')}
                        </span>
                        {entry.duration && (
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">• {entry.duration} MIN</span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden sm:flex border-white/10 text-white/40 font-black text-[9px] uppercase tracking-tighter">CONCLUÍDO</Badge>
                  </div>
                ))}
                {(!history || history.length === 0) && (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                    <Activity className="h-12 w-12 text-white" />
                    <p className="font-black uppercase tracking-widest text-xs italic">Nenhuma atividade registrada.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="diets" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diets?.map((diet) => (
              <Card key={diet.id} className="rounded-[2.2rem] p-6 bg-card border border-white/5 shadow-xl hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{diet.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                </div>
                <h4 className="font-black text-xl text-white uppercase tracking-tight mb-4">{diet.title}</h4>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed italic">{diet.description}</p>
                </div>
              </Card>
            ))}
            {(!diets || diets.length === 0) && (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                <p className="text-white/20 font-black uppercase tracking-widest italic">Sem sugestões de dieta enviadas</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDetailsPage() {
  return <Suspense fallback={<div className="p-8 animate-pulse bg-background h-screen" />}><StudentDetailsContent /></Suspense>;
}
