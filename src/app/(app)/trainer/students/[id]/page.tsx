
'use client';

import { use, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc, useUser, useCollection } from '@/firebase';
import { doc, updateDoc, collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { 
  Dumbbell, 
  Activity, 
  TrendingUp, 
  MessageSquare, 
  History,
  ArrowLeft,
  Settings,
  Edit2,
  ChevronRight
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile } = useUser();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const studentRef = useMemoFirebase(() => {
    if (!user || !id) return null;
    return doc(db, 'users', id);
  }, [db, id, user]);

  const plansQuery = useMemoFirebase(() => {
    if (!user || !id) return null;
    return query(collection(db, 'users', id, 'trainingPlans'), orderBy('createdAt', 'desc'));
  }, [db, id, user]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: plans } = useCollection(plansQuery);

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

  if (isLoading || !profile) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!student) return <div className="p-8 text-center py-20">Aluno não encontrado ou sem permissão de acesso.</div>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-none">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="rounded-2xl" onClick={() => router.back()}>
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
                      <Input id="height" name="height" type="number" defaultValue={student.height || '178'} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input id="weight" name="weight" type="number" defaultValue={student.weight || '84'} className="rounded-xl" />
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
                <p className="text-lg font-bold">{student.height || '178'} cm</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase opacity-50">Peso</p>
                <p className="text-lg font-bold">{student.weight || '84'} kg</p>
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
              <span className="text-5xl font-black text-primary">26.5</span>
              <p className="text-xs font-bold uppercase text-muted-foreground mt-1 tracking-widest">IMC Atual</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">Gordura Corporal</p>
                  <p className="text-xl font-bold">18.4%</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between bg-green-50/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">Massa Magra</p>
                  <p className="text-xl font-bold">68.2 kg</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações do Professor */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Ações do Professor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="rounded-2xl h-14 font-bold bg-primary text-white w-full">
              <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                <Dumbbell className="h-5 w-5 mr-2" />
                Montar Novo Treino
              </Link>
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full">
              <History className="h-5 w-5 mr-2" />
              Ver Histórico Completo
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full">
              <MessageSquare className="h-5 w-5 mr-2" />
              Enviar Dica Direta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Treinos Atribuídos */}
      <div className="mt-4">
        <h2 className="text-xl font-bold font-headline mb-4 px-1">Planos de Treino</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan) => (
            <Card key={plan.id} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase">
                    {plan.exercises?.length || 0} Ex.
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight uppercase">{plan.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                    Criado em: {plan.createdAt?.toDate().toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button asChild variant="outline" className="flex-1 rounded-xl font-bold border-2 h-10">
                    <Link href={`/trainer/workouts/builder?studentId=${id}&planId=${plan.id}`}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 border-2">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {plans?.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/20">
              <p className="text-muted-foreground font-medium">Nenhum plano de treino criado para este aluno.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
