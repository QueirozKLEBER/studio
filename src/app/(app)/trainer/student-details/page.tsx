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

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!student) return <div className="p-8 text-center py-20">Aluno não encontrado.</div>;

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
        <PageHeader title={`${student.firstName} ${student.lastName}`} subtitle="Gestão total do aluno." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] bg-white p-6 relative">
          <div className="absolute top-4 right-4">
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-md">
                <DialogHeader><DialogTitle>Editar Perfil</DialogTitle></DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input name="firstName" defaultValue={student.firstName} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sobrenome</Label>
                      <Input name="lastName" defaultValue={student.lastName} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Altura (cm)</Label>
                      <Input name="height" type="number" defaultValue={student.height || ''} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Peso (kg)</Label>
                      <Input name="weight" type="number" defaultValue={student.weight || ''} className="rounded-xl" />
                    </div>
                  </div>
                  <DialogFooter><Button type="submit" className="w-full rounded-2xl" disabled={isUpdating}>Salvar</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-3xl font-black text-primary mb-4">{student.firstName[0]}</div>
            <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
            <Badge className="mt-2 bg-primary">PLANO PERSONAL</Badge>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] bg-white p-6">
          <CardHeader><CardTitle className="text-lg font-bold">Evolução Corporal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-black text-primary">
                {student.weight && student.height 
                  ? (parseFloat(student.weight) / ((parseFloat(student.height)/100)**2)).toFixed(1)
                  : '--'}
              </span>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mt-1">IMC Estimado</p>
            </div>
            <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl">
              <span className="text-xs font-bold">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-none">ATIVO</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] bg-white p-6 flex flex-col gap-3">
          <Button asChild className="w-full h-14 rounded-2xl font-bold">
            <Link href={`/trainer/workouts/builder?studentId=${id}`}>Montar Novo Treino</Link>
          </Button>
          <Dialog open={isDietModalOpen} onOpenChange={setIsDietModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-2">Sugerir Dieta</Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-lg">
              <DialogHeader><DialogTitle>Nova Dieta</DialogTitle></DialogHeader>
              <form onSubmit={handleAddDiet} className="space-y-4 py-4">
                <Input name="title" placeholder="Título" required className="rounded-xl" />
                <Textarea name="description" placeholder="Detalhes..." required className="rounded-xl min-h-[150px]" />
                <Button type="submit" className="w-full rounded-2xl" disabled={isUpdating}>Enviar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="mt-8">
        <TabsList className="bg-muted p-1 rounded-2xl h-12 w-full md:w-auto">
          <TabsTrigger value="workouts" className="px-8 font-bold flex-1 md:flex-none">Treinos</TabsTrigger>
          <TabsTrigger value="report" className="px-8 font-bold flex-1 md:flex-none">Relatório</TabsTrigger>
          <TabsTrigger value="diets" className="px-8 font-bold flex-1 md:flex-none">Dieta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans?.map((plan) => (
              <Card key={plan.id} className="rounded-3xl p-5 bg-white shadow-sm border-none">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Dumbbell className="h-5 w-5" /></div>
                  <Badge variant="outline">{plan.exercises?.length || 0} Ex.</Badge>
                </div>
                <h4 className="font-bold text-lg uppercase">{plan.name}</h4>
                <p className="text-[10px] text-muted-foreground font-bold">{plan.createdAt?.toDate().toLocaleDateString('pt-BR')}</p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full rounded-xl border-2"><Link href={`/trainer/workouts/builder?studentId=${id}&planId=${plan.id}`}>Editar</Link></Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <Card className="rounded-[2.5rem] p-6 bg-white border-none shadow-sm">
            <ScrollArea className="h-[400px]">
              {history?.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm", entry.type === 'manual' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600")}>
                    {entry.activityType === 'cardio' ? <Flame className="h-6 w-6" /> : <Dumbbell className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase">{entry.planName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold opacity-50">{entry.completedAt?.toDate().toLocaleDateString('pt-BR')}</span>
                      {entry.duration && <span className="text-[10px] font-bold text-muted-foreground italic">• {entry.duration} min</span>}
                    </div>
                  </div>
                </div>
              ))}
              {(!history || history.length === 0) && (
                <div className="py-20 text-center opacity-30 italic">Nenhuma atividade registrada.</div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="diets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diets?.map((diet) => (
              <Card key={diet.id} className="rounded-3xl p-5 bg-white border-none shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{diet.title}</h4>
                  <span className="text-[10px] font-bold opacity-50">{diet.createdAt?.toDate().toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{diet.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDetailsPage() {
  return <Suspense fallback={<div>Carregando...</div>}><StudentDetailsContent /></Suspense>;
}