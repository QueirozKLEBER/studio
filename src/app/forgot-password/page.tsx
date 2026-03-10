'use client';

import { AuthCard } from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar Senha"
      description="Digite seu e-mail para receber um link de redefinição de senha."
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/40 font-black text-[10px] uppercase tracking-widest ml-1">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required className="rounded-2xl h-14 border-none bg-black/20 text-white font-bold px-6 focus-visible:ring-primary" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-[1.8rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tight mt-4">
          ENVIAR LINK
        </Button>
      </form>
      <div className="mt-8 text-center">
        <Link href="/login" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">
          Voltar para o login
        </Link>
      </div>
    </AuthCard>
  );
}
