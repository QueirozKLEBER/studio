'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Users, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function TrainerDashboard() {
  const { profile } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);

  const { data: students, isLoading } = useCollection(studentsQuery);
  const filtered = students?.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <PageHeader title={`Olá, Prof. ${profile?.firstName || '...'}`} subtitle="Gerencie seus alunos." />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar aluno..." 
          className="pl-10 rounded-2xl h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? [1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />) :
          filtered?.map((student) => (
            <Card key={student.id} className="rounded-[2rem] p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold">{student.firstName[0]}</div>
              <div className="flex-1">
                <h3 className="font-bold">{student.firstName} {student.lastName}</h3>
                <p className="text-xs opacity-50">Aluno Premium</p>
              </div>
              <Button asChild variant="ghost" className="rounded-xl"><Link href={`/trainer/student-details?id=${student.id}`}><ChevronRight /></Link></Button>
            </Card>
          ))
        }
      </div>
    </div>
  );
}
