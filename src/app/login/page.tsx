'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, ShieldAlert, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'student' | 'trainer' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user && profile) {
      if (profile.userType === 'admin') router.push('/admin/dashboard');
      else if (profile.userType === 'trainer') router.push('/trainer/dashboard');
      else router.push('/dashboard');
    }
  }, [user, profile, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Preencha e-mail e senha.' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let description = 'E-mail ou senha inválidos.';
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') description = 'Usuário não encontrado.';
      }
      toast({ variant: "destructive", title: "Erro no Login", description });
      setIsLoading(false);
    }
  };

  if (isUserLoading || (user && profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Skeleton className="h-[400px] w-full max-w-md rounded-[3rem]" />
      </div>
    );
  }

  return (
    <AuthCard
      title="Entrar no TreinusFit"
      description="Escolha seu tipo de acesso para continuar."
      footerText="Não tem uma conta?"
      footerLink="/signup"
      footerLinkText="Cadastre-se"
    >
      <div className="mb-6">
        <Tabs value={loginRole} onValueChange={(v) => setLoginRole(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-12 rounded-2xl bg-slate-200 p-1">
            <TabsTrigger value="student" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <UserCircle className="h-4 w-4 mr-2" />
              Aluno
            </TabsTrigger>
            <TabsTrigger value="trainer" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <GraduationCap className="h-4 w-4 mr-2" />
              Prof
            </TabsTrigger>
            <TabsTrigger value="admin" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <ShieldAlert className="h-4 w-4 mr-2" />
              ADM
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-black text-[10px] uppercase text-slate-500 tracking-widest">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="rounded-xl h-12 border-slate-200 bg-white" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-black text-[10px] uppercase text-slate-500 tracking-widest">Senha</Label>
            <Link href="/forgot-password" className="text-[10px] font-bold underline text-slate-400">Esqueceu?</Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="rounded-xl h-12 border-slate-200 bg-white" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tight" disabled={isLoading}>
          {isLoading ? 'Acessando...' : 'ENTRAR AGORA'}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center justify-center mb-6">
          <Separator className="bg-slate-200" />
          <span className="absolute bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ou continue com</span>
        </div>
        <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50" type="button" disabled={isLoading}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </Button>
      </div>
    </AuthCard>
  );
}