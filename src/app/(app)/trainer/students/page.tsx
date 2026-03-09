
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Users, ChevronRight, Search, User, Activity } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function TrainerStudentsPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  // Consulta real: busca alunos onde o userType é 'student'
  // Nota: Poderia ser filtrado por trainerId == profile.id se os alunos forem vinculados
  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);

  const { data: students, isLoading } = useCollection(studentsQuery);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Meus Alunos" 
        subtitle="Gestão técnica e acompanhamento de evolução da sua equipe." 
      />

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <Input 
          placeholder="BUSCAR ALUNO PELO NOME..." 
          className="rounded-2xl h-14 pl-12 bg-card border-white/5 text-white font-black uppercase text-[10px] tracking-widest focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="h-24 rounded-[2rem] animate-pulse bg-card border-white/5" />
          ))
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student.id} className="rounded-[2rem] border border-white/5 shadow-xl bg-card hover:border-primary/20 transition-all group overflow-hidden">
              <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center font-black text-xl shadow-inner border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                    {student.firstName?.[0] || 'A'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white uppercase tracking-tight truncate">{student.firstName} {student.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-none bg-primary/10 text-primary font-black text-[8px] uppercase px-2 py-0.5">
                        ALUNO PREMIUM
                      </Badge>
                      <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest truncate">{student.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="hidden md:flex flex-col items-end mr-4">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Peso Atual</p>
                    <p className="text-xs font-black text-white">{student.weight || '--'} KG</p>
                  </div>

                  <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 hover:bg-primary hover:text-white transition-all">
                    <Link href={`/trainer/student-details?id=${student.id}`}>
                      <ChevronRight className="h-6 w-6" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <Users className="h-16 w-16 mx-auto mb-4" />
            <p className="font-black uppercase tracking-[0.2em] italic">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
