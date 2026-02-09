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
        <Skeleton className="h-[400px] w-full max-w-md rounded-3xl" />
      </div>
    );
  }

  return (
    <AuthCard
      title="Entrar no MFIT"
      description="Escolha seu tipo de acesso para continuar."
      footerText="Não tem uma conta?"
      footerLink="/signup"
      footerLinkText="Cadastre-se"
    >
      <div className="mb-6">
        <Tabs value={loginRole} onValueChange={(v) => setLoginRole(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-12 rounded-2xl bg-muted p-1">
            <TabsTrigger value="student" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <UserCircle className="h-4 w-4 mr-2" />
              Aluno
            </TabsTrigger>
            <TabsTrigger value="trainer" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <GraduationCap className="h-4 w-4 mr-2" />
              Prof
            </TabsTrigger>
            <TabsTrigger value="admin" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ShieldAlert className="h-4 w-4 mr-2" />
              ADM
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/forgot-password" className="text-xs underline text-muted-foreground">Esqueceu a senha?</Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="rounded-xl" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-2xl font-bold shadow-lg" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar Agora'}
        </Button>
      </form>

      <div className="mt-6">
        <Separator className="mb-4" />
        <Button variant="outline" className="w-full rounded-2xl h-11" type="button" disabled={isLoading}>
          Entrar com Google
        </Button>
      </div>
    </AuthCard>
  );
}
