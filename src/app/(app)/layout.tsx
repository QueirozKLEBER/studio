
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ShieldBan, LogOut, Loader2, CreditCard } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lógica de verificação de vencimento automática
  const isExpired = useMemo(() => {
    if (!mounted || !profile || profile.userType !== 'student' || !profile.paymentDueDate) return false;
    const dueDate = new Date(profile.paymentDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > dueDate;
  }, [profile, mounted]);

  // Bloqueio automático se o pagamento vencer
  useEffect(() => {
    if (isExpired && profile?.status !== 'blocked' && profile?.id) {
      const autoBlock = async () => {
        try {
          await updateDoc(doc(db, 'users', profile.id), { status: 'blocked' });
          toast({ 
            variant: 'destructive', 
            title: "Assinatura Suspensa", 
            description: "Detectamos que sua mensalidade está vencida." 
          });
        } catch (e) {
          console.error("Erro no auto-block:", e);
        }
      };
      autoBlock();
    }
  }, [isExpired, profile, db, toast]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Tela de Bloqueio para Alunos Inadimplentes
  // Permite acesso apenas à página de billing para regularização
  if (profile?.status === 'blocked' && profile?.userType === 'student' && pathname !== '/billing') {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center p-8 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="space-y-10 flex flex-col items-center max-w-sm">
          <div className="h-32 w-32 bg-primary/10 text-primary rounded-[3rem] flex items-center justify-center shadow-2xl border border-primary/20">
            <ShieldBan className="h-16 w-16" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">
              PAGAMENTO <span className="text-primary">PENDENTE</span>
            </h2>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
              <p className="text-primary font-black uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                Seu acesso foi suspenso. Regularize sua mensalidade para continuar treinando com excelência.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/billing" className="w-full h-16 rounded-2xl bg-primary text-white font-black flex items-center justify-center shadow-xl hover:bg-primary/90 uppercase tracking-widest text-sm">
              <CreditCard className="mr-2 h-5 w-5" /> VER MINHA FATURA
            </Link>
            <button onClick={() => signOut(auth).then(() => router.push('/login'))} className="flex items-center justify-center gap-3 px-8 h-14 rounded-2xl border border-white/10 text-white/40 hover:text-white uppercase font-black text-xs">
              <LogOut className="h-5 w-5" /> Sair da Conta
            </button>
          </div>
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
