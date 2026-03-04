
'use client';

import { use, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useUser, useCollection } from '@/firebase';
import { doc, updateDoc, collection, query, orderBy, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { 
  Dumbbell, 
  Activity, 
  TrendingUp, 
  History,
  ArrowLeft,
  Settings,
  Edit2,
  Trash2,
  Utensils,
  Clock,
  Zap,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile } = useUser();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const studentRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(db, 'users', id);
  }, [db, id, user]);

  const plansQuery = useMemoFirebase(() => {
    if (!user || !id) return null;
    return query(collection(db, 'users', id, 'trainingPlans'), orderBy('createdAt', 'desc'));
  }, [db, id, user]);

  const dietsQuery = useMemoFirebase(() => {
    if (!user || !id) return null;
    return query(collection(db, 'users', id, 'dietSuggestions'), orderBy('createdAt', 'desc'));
  }, [db, id, user]);

  const historyQuery = useMemoFirebase(() => {
    if (!user || !id) return null;
    return query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc'));
  }, [db, id, user]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: plans } = useCollection(plansQuery);
  const { data: diets } = useCollection(dietsQuery);
  const { data: history } = useCollection(historyQuery);

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
      toast({ title: "Perfil atualizado", description: "Os dados do aluno foram salvos com sucesso." });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o perfil." });
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
      toast({ title: "Dieta adicionada", description: "Sugestão enviada com sucesso." });
      setIsDietModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao salvar sugestão." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!id) return;
    try {
      const planDocRef = doc(db, 'users', id, 'trainingPlans', planId);
      await deleteDoc(planDocRef);
      toast({ title: "Treino excluído", description: "O plano de treino foi removido com sucesso." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o treino." });
    }
  };

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!student) return <div className="p-8 text-center py-20">Aluno não encontrado.</div>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-none pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader 
          title={`${student.firstName} ${student.lastName}`} 
          subtitle="Gerenciamento total do aluno e evolução corporal." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Perfil */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Perfil</CardTitle>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Editar Perfil do Aluno</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" name="firstName" defaultValue={student.firstName} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" name="lastName" defaultValue={student.lastName} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input id="height" name="height" type="number" defaultValue={student.height || ''} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input id="weight" name="weight" type="number" defaultValue={student.weight || ''} className="rounded-xl" />
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full rounded-2xl font-bold" disabled={isUpdating}>
                      {isUpdating ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-3xl font-black text-primary mb-4">
                {student.firstName[0]}
              </div>
              <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <Badge className="mt-2 bg-primary text-white font-bold">PLANO PERSONAL</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase opacity-50">Altura</p>
                <p className="text-lg font-bold">{student.height || '--'} cm</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase opacity-50">Peso</p>
                <p className="text-lg font-bold">{student.weight || '--'} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evolução Corporal */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Evolução Corporal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-5xl font-black text-primary">
                {student.weight && student.height 
                  ? (parseFloat(student.weight) / ((parseFloat(student.height)/100)**2)).toFixed(1)
                  : '--'}
              </span>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1 tracking-widest">IMC Estimado</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">Treinos p/ Mês</p>
                  <p className="text-xl font-bold">{history?.length || 0}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between bg-green-50/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">Status de Atividade</p>
                  <p className="text-xl font-bold">ATIVO</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="rounded-2xl h-14 font-bold bg-primary text-white w-full">
              <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                <Dumbbell className="h-5 w-5 mr-2" />
                Montar Novo Treino
              </Link>
            </Button>
            
            <Dialog open={isDietModalOpen} onOpenChange={setIsDietModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full">
                  <Utensils className="h-5 w-5 mr-2" />
                  Sugerir Dieta
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Nova Sugestão de Dieta</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddDiet} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Orientação</Label>
                    <Input id="title" name="title" placeholder="Ex: Dieta para Hipertrofia - Fase 1" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Detalhes / Cardápio Sugerido</Label>
                    <Textarea id="description" name="description" placeholder="Descreva as refeições..." className="rounded-xl min-h-[200px]" required />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full rounded-2xl font-bold" disabled={isUpdating}>
                      {isUpdating ? "Enviando..." : "Liberar Dieta"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="mt-8">
        <TabsList className="bg-muted p-1 rounded-2xl h-12 gap-1 w-full md:w-auto">
          <TabsTrigger value="workouts" className="rounded-xl font-bold px-8 flex-1 md:flex-none">Treinos</TabsTrigger>
          <TabsTrigger value="report" className="rounded-xl font-bold px-8 flex-1 md:flex-none">Relatório</TabsTrigger>
          <TabsTrigger value="diets" className="rounded-xl font-bold px-8 flex-1 md:flex-none">Dieta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans?.map((plan) => (
              <Card key={plan.id} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {plan.exercises?.length || 0} Ex.
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight uppercase">{plan.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                      {plan.createdAt?.toDate().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button asChild variant="outline" className="flex-1 rounded-xl font-bold border-2 h-10">
                      <Link href={`/trainer/workouts/builder?studentId=${id}&planId=${plan.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Treino?</AlertDialogTitle>
                          <AlertDialogDescription>O treino será removido permanentemente.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Voltar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="rounded-xl bg-destructive text-white">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Histórico de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {history?.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-[1.5rem] border border-muted-foreground/5">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                        entry.type === 'manual' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {entry.activityType === 'cardio' ? <Flame className="h-6 w-6" /> : 
                         entry.activityType === 'hiit' ? <Zap className="h-6 w-6" /> : 
                         <Dumbbell className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm uppercase truncate">{entry.planName}</h4>
                          <span className="text-[10px] font-black opacity-50 uppercase whitespace-nowrap">
                            {entry.completedAt?.toDate().toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-none bg-white">
                            {entry.type === 'manual' ? 'Atividade Extra' : 'Treino Planificado'}
                          </Badge>
                          {entry.duration && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                              <Clock className="h-3 w-3" /> {entry.duration} min
                            </span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-xs mt-2 text-muted-foreground italic bg-white/50 p-2 rounded-lg border border-muted">
                            "{entry.notes}"
                          </p>
                        )}
                        {entry.exerciseCount && (
                          <p className="text-[10px] mt-2 font-bold text-primary">
                            Volume: {entry.completedExercisesCount}/{entry.exerciseCount} exercícios concluídos
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!history || history.length === 0) && (
                    <div className="py-20 text-center opacity-30 flex flex-col items-center">
                      <History className="h-12 w-12 mb-2" />
                      <p className="font-bold uppercase text-xs">Nenhuma atividade registrada ainda.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diets?.map((diet) => (
              <Card key={diet.id} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-blue-50/30 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{diet.title}</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1">
                      {diet.createdAt?.toDate().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/20 p-4 rounded-2xl">
                    {diet.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
