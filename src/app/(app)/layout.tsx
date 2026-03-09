
'use client';

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ShieldBan } from 'lucide-react';

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

  // Logout imediato se o usuário estiver bloqueado (opcional, mantendo a tela de aviso primeiro)
  useEffect(() => {
    if (!isUserLoading && profile?.status === 'blocked') {
      toast({
        variant: 'destructive',
        title: "Acesso Suspenso",
        description: "Sua conta está inativa no momento.",
      });
      // Poderia dar signOut aqui, mas vamos manter a tela de aviso ativa para o usuário ler a instrução
    }
  }, [profile, isUserLoading, toast]);

  if (isUserLoading || !user || profile?.status === 'blocked') {
    return (
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden items-center justify-center p-8">
        {profile?.status === 'blocked' ? (
          <div className="text-center space-y-8 flex flex-col items-center">
            <div className="h-24 w-24 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-primary/20 animate-pulse">
              <ShieldBan className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase text-white tracking-tighter">ACESSO BLOQUEADO</h2>
              <p className="text-primary font-black uppercase text-xs tracking-[0.2em] animate-bounce">
                Entre em contato com o seu professor
              </p>
            </div>
            <button 
              onClick={() => signOut(auth).then(() => router.push('/login'))}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors underline"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <div className="flex-1 max-w-4xl w-full">
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
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background overflow-x-hidden relative">
      {/* Sidebar no desktop - Fixa à esquerda */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-primary/10 bg-card z-50">
        <AppSidebar />
      </div>
      
      {/* Área de Conteúdo principal - Ocupando 100% da largura disponível */}
      <div className="flex flex-col flex-1 md:pl-64 w-full min-w-0">
        <main className="flex-1 w-full p-4 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
        
        {/* Navegação inferior para Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}
