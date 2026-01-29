'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.185-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12.027s5.56 12.027 12.173 12.027c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z"
      ></path>
    </svg>
  );

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);
    
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha todos os campos.',
            });
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, { displayName: name });

            const userRef = doc(firestore, 'users', firebaseUser.uid);
            const [firstName, ...lastName] = name.split(' ');
            
            await setDoc(userRef, {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                firstName: firstName,
                lastName: lastName.join(' '),
                dateJoined: new Date().toISOString(),
                userType: 'student',
            });
            
        } catch (error) {
            let description = 'Ocorreu um erro inesperado. Tente novamente.';
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        description = 'Este e-mail já está em uso por outra conta.';
                        break;
                    case 'auth/invalid-email':
                        description = 'O formato do e-mail é inválido.';
                        break;
                    case 'auth/weak-password':
                        description = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
                        break;
                    default:
                        description = 'Ocorreu um erro ao criar a conta.';
                        break;
                }
            }
            toast({
                variant: 'destructive',
                title: 'Erro no Cadastro',
                description,
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AuthCard
        title="Criar Conta"
        description="Comece sua transformação hoje mesmo."
        footerText="Já tem uma conta?"
        footerLink="/login"
        footerLinkText="Entrar"
        >
        <form className="space-y-4" onSubmit={handleSignUp}>
            <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Cadastrar com Google
            </Button>
            <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OU</span>
                <Separator className="flex-1" />
            </div>
            <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" type="text" placeholder="Seu nome" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
        </form>
        </AuthCard>
    );
}
