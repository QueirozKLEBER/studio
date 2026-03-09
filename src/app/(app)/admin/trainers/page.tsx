
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';
import { collection, query, where, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { GraduationCap, Mail, Calendar, ShieldBan, ShieldCheck, Loader2, Plus, UserPlus, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminTrainersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const trainersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'trainer')), [db]);
  const { data: trainers, isLoading } = useCollection(trainersQuery);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdatingId(userId);
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus
      });
      toast({
        title: newStatus === 'blocked' ? "Acesso Bloqueado" : "Acesso Liberado",
        description: `O status do professor foi atualizado.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao atualizar",
        description: "Falha na comunicação com o sistema.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateTrainer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (!email || !password || !firstName) {
      toast({ variant: 'destructive', title: "Campos obrigatórios" });
      return;
    }

    setIsCreating(true);
    
    // Criamos uma instância secundária do Firebase para não deslogar o admin atual
    const tempAppName = `temp-app-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);

    try {
      // 1. Criar usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const newUserId = userCredential.user.uid;

      // 2. Criar perfil no Firestore
      await setDoc(doc(db, 'users', newUserId), {
        id: newUserId,
        email,
        firstName,
        lastName: lastName || '',
        userType: 'trainer',
        status: 'active',
        dateJoined: new Date().toISOString(),
      });

      toast({ title: "Professor Criado!", description: "O acesso já está liberado." });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: "Erro ao criar", 
        description: error.message || "Verifique se o e-mail já está em uso." 
      });
    } finally {
      await deleteApp(tempApp);
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão de Professores" 
          subtitle="Administre a equipe técnica de elite da plataforma." 
        />
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black text-sm bg-primary text-white shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95">
              <UserPlus className="mr-2 h-5 w-5" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] max-w-md bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">Cadastrar Novo Professor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTrainer} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase text-white/40">Nome</Label>
                  <Input name="firstName" placeholder="Ex: Rodrigo" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase text-white/40">Sobrenome</Label>
                  <Input name="lastName" placeholder="Ex: Silva" className="rounded-xl bg-white/5 border-none h-12 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase text-white/40">E-mail de Acesso</Label>
                <Input name="email" type="email" placeholder="professor@treinusfit.com" required className="rounded-xl bg-white/5 border-none h-12 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase text-white/40">Senha Inicial</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input name="password" type="password" placeholder="Mínimo 6 caracteres" required className="rounded-xl bg-white/5 border-none h-12 pl-10 font-bold" />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full rounded-2xl h-14 bg-primary font-black uppercase shadow-xl shadow-primary/20" disabled={isCreating}>
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'FINALIZAR CADASTRO'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-56 rounded-[2.5rem] animate-pulse bg-card border-white/5" />)
        ) : trainers?.map((trainer) => (
          <Card key={trainer.id} className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden hover:border-primary/20 transition-all flex flex-col group">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  {trainer.firstName?.[0] || 'P'}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-primary/10 text-primary border-none font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1">
                    PROFESSOR
                  </Badge>
                  <Badge variant="outline" className={trainer.status === 'blocked'
                    ? "bg-red-500/10 border-red-500 text-red-500 font-black text-[7px] uppercase px-2"
                    : "border-green-500/30 text-green-500 font-black text-[7px] uppercase px-2"
                  }>
                    {trainer.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{trainer.firstName} {trainer.lastName}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    {trainer.email}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    Desde {isMounted && trainer.dateJoined ? new Date(trainer.dateJoined).toLocaleDateString('pt-BR') : '...'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl h-11 font-black text-[9px] uppercase tracking-[0.15em] border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all shadow-xl"
                  onClick={() => toggleUserStatus(trainer.id, trainer.status || 'active')}
                  disabled={updatingId === trainer.id}
                >
                  {updatingId === trainer.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : trainer.status === 'blocked' ? (
                    <><ShieldCheck className="h-4 w-4 mr-2" /> DESBLOQUEAR ACESSO</>
                  ) : (
                    <><ShieldBan className="h-4 w-4 mr-2" /> BLOQUEAR ACESSO</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!isLoading && (!trainers || trainers.length === 0)) && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <GraduationCap className="h-16 w-16 mx-auto mb-4" />
            <p className="font-black uppercase tracking-[0.2em] italic">Nenhum professor registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
