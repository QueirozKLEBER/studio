'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Users, Mail, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const db = useFirestore();
  const studentsQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'student')), [db]);
  const { data: students, isLoading } = useCollection(studentsQuery);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Gestão de Alunos" 
        subtitle="Controle global de todos os alunos da plataforma." 
      />

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-20 rounded-2xl animate-pulse bg-muted" />)
        ) : students?.map((student) => (
          <Card key={student.id} className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {student.firstName[0]}
                </div>
                <div>
                  <h3 className="font-bold">{student.firstName} {student.lastName}</h3>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Badge variant="outline" className="hidden md:flex border-green-200 text-green-600 font-bold">ATIVO</Badge>
                <Button variant="ghost" size="sm" asChild className="rounded-xl">
                  <Link href={`/trainer/students/${student.id}`}>
                    Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
