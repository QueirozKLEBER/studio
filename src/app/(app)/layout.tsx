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

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-background overflow-y-auto min-w-0 p-4 pt-20 md:p-8">
        {isUserLoading || !user ? (
            <div>
                {/* This is a skeleton for the content of a page, e.g. the PageHeader and the content grid */}
                <div className="mb-4">
                    <Skeleton className="h-10 md:h-12 w-48 md:w-64" />
                    <Skeleton className="h-5 md:h-6 w-72 md:w-96 mt-2" />
                </div>
                {/* A generic content skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                </div>
            </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
