'use client'; // Needs to be a client component to use hooks

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { useUser } from '@/firebase'; // Using the simplified alias
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
      <div className="flex min-h-screen">
        <div className="hidden md:block border-r p-4">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <main className="flex-1 p-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-background overflow-y-auto px-4 pt-20 pb-4 sm:px-6 sm:pb-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
