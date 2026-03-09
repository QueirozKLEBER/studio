'use client';

import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-center">
      <div className="p-8 rounded-[3.5rem] shadow-2xl mb-12 animate-pulse bg-card border border-white/5 flex items-center justify-center">
        <Logo className="h-40 w-40" />
      </div>
      
      <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">
        TreinusFit <span className="text-primary">Personal</span>
      </h1>
      
      <p className="text-muted-foreground mb-12 max-w-xs font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">
        Elite Training Systems
      </p>
      
      <Link 
        href="/login" 
        className="group relative w-full max-w-sm h-20 rounded-[2rem] overflow-hidden flex items-center justify-center transition-all active:scale-95"
      >
        <div className="absolute inset-0 bg-primary shadow-[0_10px_40px_-10px_rgba(255,0,0,0.5)] group-hover:bg-primary/90 transition-colors" />
        <span className="relative text-2xl font-black text-white uppercase tracking-tight">
          Iniciar Treino
        </span>
      </Link>
      
      <div className="mt-16 flex gap-3">
        <div className="h-1.5 w-10 bg-primary rounded-full" />
        <div className="h-1.5 w-6 bg-white/10 rounded-full" />
        <div className="h-1.5 w-6 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}