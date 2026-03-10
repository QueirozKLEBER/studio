
'use client';

import React, { useEffect, useMemo } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ShieldBan, LogOut, CreditCard, AlertTriangle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  // Lógica de verificação de vencimento automática
  const isExpired = useMemo(() => {
    if (profile?.userType !== 'student' || !profile?.paymentDueDate) return false;
    const dueDate = new Date(profile.paymentDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > dueDate;
  }, [profile]);

  // Efeito para bloquear o aluno se o pagamento vencer
  useEffect(() => {
    if (isExpired && profile?.status === 'active') {
      const updateStatus = async () => {
        try {
          await updateDoc(doc(db, 'users', profile.id), { status: 'blocked' });
          toast({ variant: 'destructive', title: "Acesso Bloqueado", description: "Vencimento detectado pelo sistema." });
        } catch (e) {
          console.error("Erro ao auto-bloquear aluno", e);
        }
      };
      updateStatus();
    }
  }, [isExpired, profile, db, toast]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Tela de Bloqueio
  if (profile?.status === 'blocked') {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="text-center space-y-10 flex flex-col items-center max-w-sm animate-in fade-in zoom-in duration-500">
          <div className="h-32 w-32 bg-primary/10 text-primary rounded-[3rem] flex items-center justify-center shadow-2xl border border-primary/20 animate-pulse">
            <ShieldBan className="h-16 w-16" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">
              ACESSO <span className="text-primary">RESTRITO</span>
            </h2>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <p className="text-primary font-black uppercase text-xs tracking-[0.15em] leading-relaxed">
                Detectamos pendências na sua conta. Entre em contato com seu professor para regularizar seu acesso.
              </p>
            </div>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push('/login'))} className="flex items-center gap-3 px-8 h-14 rounded-2xl border border-white/10 text-white/40 hover:text-white uppercase font-black text-xs">
            <LogOut className="h-5 w-5" /> Sair da Conta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background overflow-x-hidden relative">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-primary/10 bg-card z-50">
        <AppSidebar />
      </div>
      <div className="flex flex-col flex-1 md:pl-64 w-full min-w-0">
        <main className="flex-1 w-full p-4 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
