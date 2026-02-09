'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { 
  Dumbbell, 
  Activity, 
  TrendingUp, 
  MessageSquare, 
  History,
  ArrowLeft,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentDetails({ params }: { params: { id: string } }) {
  const db = useFirestore();
  const router = useRouter();
  
  const studentRef = useMemoFirebase(() => doc(db, 'users', params.id), [db, params.id]);
  const { data: student, isLoading } = useDoc(studentRef);

  if (isLoading) return <div className="p-8 animate-pulse bg-muted h-screen" />;
  if (!student) return <div className="p-8">Aluno não encontrado.</div>;

  return (
    <div className="flex flex-col gap-6">
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
        {/* Info do Aluno */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Perfil</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
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
                <p className="text-lg font-bold">178 cm</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase opacity-50">Peso</p>
                <p className="text-lg font-bold">84 kg</p>
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

        {/* Ações Rápidas */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Ações do Professor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="rounded-2xl h-14 font-bold bg-primary text-white w-full">
              <Link href="/trainer/workouts/builder">
                <Dumbbell className="h-5 w-5 mr-2" />
                Montar Novo Treino
              </Link>
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full">
              <History className="h-5 w-5 mr-2" />
              Ver Histórico
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full">
              <MessageSquare className="h-5 w-5 mr-2" />
              Enviar Dica Direta
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 font-bold border-2 w-full text-destructive hover:text-destructive hover:bg-destructive/5">
              Bloquear Acesso
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <h2 className="text-xl font-bold font-headline">Treino Atual</h2>
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black">Hipertrofia - Semana 4</h3>
              <p className="text-muted-foreground">Última atualização: Há 2 dias</p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold">Editar Treino</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
