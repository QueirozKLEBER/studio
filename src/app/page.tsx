'use client';

import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6 text-center">
      <div className="p-8 rounded-[3rem] shadow-2xl mb-8 animate-pulse bg-card border border-white/5">
        <Logo className="h-32 w-32" />
      </div>
      
      <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">
        TreinusFit <span className="text-primary">Personal</span>
      </h1>
      
      <p className="text-muted-foreground mb-12 max-w-xs font-bold uppercase tracking-widest text-xs opacity-60">
        Elite Training Systems
      </p>
      
      <Link 
        href="/login" 
        className="w-full max-w-sm h-20 rounded-[2rem] text-2xl font-black bg-primary text-white shadow-[0_10px_40px_-10px_rgba(255,0,0,0.5)] active:scale-95 transition-all flex items-center justify-center uppercase tracking-tight hover:bg-primary/90"
      >
        Iniciar Treino
      </Link>
      
      <div className="mt-12 flex gap-4">
        <div className="h-1 w-8 bg-primary rounded-full" />
        <div className="h-1 w-8 bg-white/20 rounded-full" />
        <div className="h-1 w-8 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
