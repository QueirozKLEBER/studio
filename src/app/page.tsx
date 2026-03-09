'use client';

import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="p-6 rounded-3xl shadow-2xl mb-8 animate-bounce bg-white">
        <Logo className="h-20 w-20" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
        TreinusFit Personal
      </h1>
      <p className="text-slate-500 mb-10 max-w-xs font-medium">
        Sua plataforma de treino de elite na palma da sua mão.
      </p>
      
      <Link 
        href="/login" 
        className="w-full max-w-sm h-16 rounded-2xl text-xl font-bold bg-primary text-white shadow-xl active:scale-95 transition-transform flex items-center justify-center decoration-transparent"
      >
        Iniciar Treino
      </Link>
    </div>
  );
}
