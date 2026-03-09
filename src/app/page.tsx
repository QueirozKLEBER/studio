'use client';

import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="p-10 rounded-[4rem] shadow-2xl mb-12 bg-white border border-slate-100 flex items-center justify-center scale-110">
        <Logo className="h-40 w-40" />
      </div>
      
      <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">
        TreinusFit <span className="text-primary">Personal</span>
      </h1>
      
      <p className="text-slate-400 mb-12 max-w-xs font-black uppercase tracking-[0.3em] text-[10px]">
        Elite Training Systems • Pro Edition
      </p>
      
      <Link 
        href="/login" 
        className="group relative w-full max-w-sm h-20 rounded-[2.5rem] overflow-hidden flex items-center justify-center transition-all active:scale-95 shadow-2xl"
      >
        <div className="absolute inset-0 bg-primary shadow-[0_15px_40px_-10px_rgba(255,0,0,0.4)] group-hover:bg-primary/90 transition-colors" />
        <span className="relative text-2xl font-black text-white uppercase tracking-tight">
          Iniciar Treino
        </span>
      </Link>
      
      <div className="mt-16 flex gap-3">
        <div className="h-2 w-12 bg-primary rounded-full" />
        <div className="h-2 w-6 bg-slate-200 rounded-full" />
        <div className="h-2 w-6 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}