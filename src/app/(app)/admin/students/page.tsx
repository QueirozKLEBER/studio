
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { ArrowRight, User, ShieldBan, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AdminStudentsPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const studentsQuery = useMemoFirebase(() => {
    if (!profile) return null;
    return query(collection(db, 'users'), where('userType', '==', 'student'));
  }, [db, profile]);
  
  const { data: students, isLoading } = useCollection(studentsQuery);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdatingId(userId);
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus
      });
      toast({
        title: newStatus === 'blocked' ? "Acesso Bloqueado" : "Acesso Liberado",
        description: `O status do aluno foi atualizado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status do usuário.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

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
          <Card key={student.id} className="rounded-[2rem] border border-white/5 shadow-xl bg-card hover:border-primary/20 transition-all group overflow-hidden">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-14 w-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center font-black text-xl shadow-inner border border-white/5 shrink-0">
                  {student.firstName?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white uppercase tracking-tight truncate">{student.firstName} {student.lastName}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{student.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Badge variant="outline" className={student.status === 'blocked' 
                  ? "bg-primary/10 border-primary text-primary font-black text-[9px] uppercase px-3 py-1"
                  : "border-green-500/30 text-green-500 font-black text-[9px] uppercase px-3 py-1"
                }>
                  {student.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}
                </Badge>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-white/10 hover:bg-primary hover:border-primary transition-all font-black text-[9px] uppercase"
                  onClick={() => toggleUserStatus(student.id, student.status || 'active')}
                  disabled={updatingId === student.id}
                >
                  {updatingId === student.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : student.status === 'blocked' ? (
                    <><ShieldCheck className="h-4 w-4 mr-2" /> LIBERAR</>
                  ) : (
                    <><ShieldBan className="h-4 w-4 mr-2" /> BLOQUEAR</>
                  )}
                </Button>

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
