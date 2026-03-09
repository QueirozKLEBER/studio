'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);
  
  const { data: students, isLoading } = useCollection(studentsQuery);

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Gestão de Alunos" 
        subtitle="Controle global de todos os alunos da plataforma." 
      />

      <div className="grid grid-cols-1 gap-4 w-full">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-24 rounded-[2rem] animate-pulse bg-card border-white/5" />)
        ) : students?.map((student) => (
          <Card key={student.id} className="rounded-[2rem] border border-white/5 shadow-xl bg-card hover:border-primary/20 transition-all group">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center font-black text-xl shadow-inner border border-white/5">
                  {student.firstName?.[0] || 'A'}
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tight">{student.firstName} {student.lastName}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{student.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="hidden sm:flex border-primary/30 text-primary font-black text-[9px] uppercase tracking-widest px-3 py-1">ATIVO</Badge>
                <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-primary hover:text-white transition-all">
                  <Link href={`/trainer/student-details?id=${student.id}`}>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {students?.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <User className="h-16 w-16 mx-auto mb-4" />
            <p className="font-black uppercase tracking-[0.2em] italic">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
