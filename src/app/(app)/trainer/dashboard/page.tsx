'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Users, Dumbbell, AlertCircle, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function TrainerDashboard() {
  const { profile } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useMemoFirebase(() => {
    // In a real app, students would be linked to this trainerId
    // For MVP, we show all students if the user is a trainer
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db]);

  const { data: students, isLoading } = useCollection(studentsQuery);

  const stats = [
    { label: 'Total de Alunos', value: students?.length || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Treinos Pendentes', value: 3, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Treinos Ativos', value: 12, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const filteredStudents = students?.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={`Olá, Prof. ${profile?.firstName}`} 
        subtitle="Gerencie seus alunos e monte treinos personalizados com facilidade." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-headline">Gerenciar Alunos</h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar aluno..." 
              className="pl-10 rounded-2xl border-none shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            [1, 2, 3].map(i => <Card key={i} className="h-24 rounded-3xl animate-pulse" />)
          ) : filteredStudents && filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <Card key={student.id} className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center font-black text-xl text-primary">
                    {student.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-none">{student.firstName} {student.lastName}</h3>
                    <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Objetivo: Hipertrofia</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-green-50 text-green-600 border-none text-[10px] font-bold">PLANO PREMIUM</Badge>
                      <Badge variant="outline" className="text-[10px] font-bold">TREINO ATUALIZADO</Badge>
                    </div>
                  </div>
                  <Button asChild variant="ghost" className="rounded-2xl h-12 w-12 p-0">
                    <Link href={`/trainer/students/${student.id}`}>
                      <ChevronRight className="h-6 w-6 text-primary" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="rounded-[2rem] border-dashed border-2 bg-transparent p-12 text-center">
              <p className="text-muted-foreground italic">Nenhum aluno encontrado.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
