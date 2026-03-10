
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, orderBy } from 'firebase/firestore';
import { ArrowRight, User, ShieldBan, ShieldCheck, Loader2, UserPlus, GraduationCap, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminStudentsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningStudentId, setAssigningStudentId] = useState<string | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");

  // Queries
  const studentsQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'student')), [db]);
  const trainersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'trainer')), [db]);
  
  const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);
  const { data: trainers, isLoading: isLoadingTrainers } = useCollection(trainersQuery);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdatingId(userId);
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      toast({ title: newStatus === 'blocked' ? "Acesso Bloqueado" : "Acesso Liberado" });
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro ao atualizar" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignTrainer = async () => {
    if (!assigningStudentId || !selectedTrainerId) return;
    setUpdatingId(assigningStudentId);
    try {
      await updateDoc(doc(db, 'users', assigningStudentId), {
        trainerId: selectedTrainerId
      });
      toast({ title: "Professor Vinculado!", description: "O aluno agora aparecerá no painel do professor selecionado." });
      setAssigningStudentId(null);
    } catch (error) {
      toast({ variant: 'destructive', title: "Erro ao vincular" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Gestão de Alunos" 
        subtitle="Controle global e vinculação de alunos a professores." 
      />

      <div className="grid grid-cols-1 gap-4 w-full">
        {isLoadingStudents ? (
          [1, 2, 3].map(i => <Card key={i} className="h-24 rounded-[2rem] animate-pulse bg-card border-white/5" />)
        ) : students?.map((student) => {
          const studentTrainer = trainers?.find(t => t.id === student.trainerId);
          
          return (
            <Card key={student.id} className="rounded-[2rem] border border-white/5 shadow-xl bg-card hover:border-primary/20 transition-all group overflow-hidden">
              <CardContent className="p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center font-black text-xl shadow-inner border border-white/5 shrink-0">
                    {student.firstName?.[0] || 'A'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white uppercase tracking-tight truncate">{student.firstName} {student.lastName}</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{student.email}</p>
                    {studentTrainer ? (
                      <div className="flex items-center gap-1 mt-1">
                        <GraduationCap className="h-3 w-3 text-primary" />
                        <span className="text-[9px] font-black text-primary uppercase">Prof. {studentTrainer.firstName}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-yellow-500/50 uppercase">Sem Professor Vinculado</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                  <Dialog open={assigningStudentId === student.id} onOpenChange={(open) => !open && setAssigningStudentId(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-white/10 hover:bg-primary hover:border-primary transition-all font-black text-[9px] uppercase px-4"
                        onClick={() => setAssigningStudentId(student.id)}
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-2" /> VINCULAR PROF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem] bg-card border-white/10 text-white max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase">Vincular Professor</DialogTitle>
                      </DialogHeader>
                      <div className="py-6 space-y-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase">Selecione o professor para {student.firstName}:</p>
                        <Select onValueChange={setSelectedTrainerId} defaultValue={student.trainerId}>
                          <SelectTrigger className="rounded-xl h-14 bg-white/5 border-none text-white font-bold">
                            <SelectValue placeholder="Selecione um Professor..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
                            {trainers?.map(trainer => (
                              <SelectItem key={trainer.id} value={trainer.id} className="font-bold uppercase text-[10px]">
                                Prof. {trainer.firstName} {trainer.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleAssignTrainer} 
                          className="w-full h-14 rounded-2xl bg-primary font-black uppercase shadow-xl"
                          disabled={!selectedTrainerId || updatingId === student.id}
                        >
                          {updatingId === student.id ? <Loader2 className="animate-spin" /> : "CONFIRMAR VÍNCULO"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

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
          );
        })}
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
