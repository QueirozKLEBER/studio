
'use client';

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ShieldBan, LogOut } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Alerta visual de bloqueio
  useEffect(() => {
    if (!isUserLoading && profile?.status === 'blocked') {
      toast({
        variant: 'destructive',
        title: "Acesso Suspenso",
        description: "Sua conta está inativa no momento.",
      });
    }
  }, [profile, isUserLoading, toast]);

  // Enquanto carrega os dados
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center p-8">
        <div className="flex-1 max-w-4xl w-full space-y-8">
          <div className="mb-8">
              <Skeleton className="h-10 w-48 mb-2 bg-white/5" />
              <Skeleton className="h-5 w-72 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
              <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
              <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Se não estiver logado (o useEffect redirecionará, mas evitamos renderizar o resto)
  if (!user) return null;

  // TELA DE BLOQUEIO ELITE DARK
  if (profile?.status === 'blocked') {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center p-8 overflow-hidden relative">
        {/* Efeito de brilho de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="text-center space-y-10 flex flex-col items-center max-w-sm animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="h-32 w-32 bg-primary/10 text-primary rounded-[3rem] flex items-center justify-center shadow-2xl border border-primary/20 animate-pulse">
              <ShieldBan className="h-16 w-16" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-background">
              <span className="text-white font-black text-[10px]">!</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">
              ACESSO <span className="text-primary">RESTRITO</span>
            </h2>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <p className="text-primary font-black uppercase text-xs tracking-[0.15em] leading-relaxed">
                Sua conta está bloqueada.<br />
                <span className="text-white">Entre em contato com o seu professor</span> para regularizar seu acesso.
              </p>
            </div>
          </div>

          <button 
            onClick={() => signOut(auth).then(() => router.push('/login'))}
            className="group flex items-center gap-3 px-8 h-14 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Sair da Conta</span>
          </button>
        </div>
      </div>
    );
  }

  // Layout normal para usuários ativos
  return (
    <div className="flex min-h-screen w-full bg-background overflow-x-hidden relative">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-primary/10 bg-card z-50">
        <AppSidebar />
      </div>
      
      <div className="flex flex-col flex-1 md:pl-64 w-full min-w-0">
        <main className="flex-1 w-full p-4 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
}
