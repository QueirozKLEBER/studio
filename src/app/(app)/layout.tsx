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
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 p-4 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-5 w-72" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background pb-16 md:pb-0">
      {/* Sidebar fixo no desktop - Removido o sticky top para evitar conflitos de largura */}
      <aside className="hidden md:block w-64 border-r bg-card h-screen shrink-0">
        <AppSidebar />
      </aside>
      
      {/* Área de Conteúdo principal - Removido mx-auto e max-w-6xl para alinhar à esquerda */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8 lg:p-10 w-full">
          {children}
        </div>
      </main>

      {/* Navegação inferior para Mobile */}
      <BottomNav />
    </div>
  );
}
