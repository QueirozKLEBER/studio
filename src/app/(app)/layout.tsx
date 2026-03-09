'use client';

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <main className="flex-1 p-4 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-10 w-48 mb-2 bg-white/5" />
                <Skeleton className="h-5 w-72 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
                <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
                <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
            </div>
        </main>
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
