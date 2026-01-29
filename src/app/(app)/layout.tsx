import React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-background overflow-y-auto px-4 pt-20 pb-4 sm:px-6 sm:pb-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
