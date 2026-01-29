'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.185-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12.027s5.56 12.027 12.173 12.027c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z"
      ></path>
    </svg>
  );

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Campos obrigatórios',
            description: 'Por favor, preencha e-mail e senha.',
        });
        return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect is handled by useEffect
    } catch (error) {
        let description = 'Ocorreu um erro inesperado. Tente novamente.';
        if (error instanceof FirebaseError) {
             switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    description = 'E-mail ou senha inválidos.';
                    break;
                case 'auth/invalid-email':
                    description = 'O formato do e-mail é inválido.';
                    break;
                default:
                    description = 'Ocorreu um erro ao tentar fazer login.';
                    break;
            }
        }
        toast({
            variant: "destructive",
            title: "Erro no Login",
            description,
        });
        setIsLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
           <AuthCard
              title="Entrar"
              description="Acesse sua conta para continuar sua jornada."
              footerText="Não tem uma conta?"
              footerLink="/signup"
              footerLinkText="Cadastre-se"
            >
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <div className="flex items-center space-x-2">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">OU</span>
                        <Separator className="flex-1" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                         <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </AuthCard>
        </div>
    );
  }

  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para continuar sua jornada."
      footerText="Não tem uma conta?"
      footerLink="/signup"
      footerLinkText="Cadastre-se"
    >
      <form className="space-y-4" onSubmit={handleLogin}>
        <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Entrar com Google
        </Button>
        <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OU</span>
            <Separator className="flex-1" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm underline text-muted-foreground"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthCard>
  );
}
