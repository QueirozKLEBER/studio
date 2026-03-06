'use client';

import { Dumbbell } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl mb-8 animate-bounce">
        <Dumbbell className="h-16 w-16 text-white" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
        TreinusFit Personal
      </h1>
      <p className="text-slate-500 mb-10 max-w-xs font-medium">
        Sua plataforma de treino de elite na palma da sua mão.
      </p>
      <button className="w-full max-w-sm h-16 rounded-2xl text-xl font-bold bg-blue-600 text-white shadow-xl active:scale-95 transition-transform flex items-center justify-center">
        Iniciar Treino
      </button>
    </div>
  );
}