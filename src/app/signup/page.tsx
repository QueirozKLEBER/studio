'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { UserCircle, ShieldAlert, GraduationCap } from 'lucide-react';

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
    const [role, setRole] = useState<'student' | 'trainer' | 'admin'>('student');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const firestore = useFirestore();
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
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            
            await setDoc(userRef, {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                firstName: firstName,
                lastName: lastName || '',
                dateJoined: new Date().toISOString(),
                userType: role,
                status: 'active'
            });

            toast({
                title: 'Conta criada!',
                description: `Bem-vindo ao TreinusFit, ${firstName}!`,
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
        description="Escolha seu perfil e comece hoje mesmo."
        footerText="Já tem uma conta?"
        footerLink="/login"
        footerLinkText="Entrar"
        >
        <div className="mb-8">
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full">
                <TabsList className="grid grid-cols-3 w-full h-14 rounded-2xl bg-black/40 p-1.5 border border-white/5">
                    <TabsTrigger value="student" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary transition-all">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Aluno
                    </TabsTrigger>
                    <TabsTrigger value="trainer" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary transition-all">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Prof
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-primary transition-all">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        ADM
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
                <Label htmlFor="name" className="text-white/40 font-black text-[10px] uppercase tracking-widest ml-1">Nome completo</Label>
                <Input id="name" type="text" placeholder="Seu nome" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="rounded-2xl h-14 border-none bg-black/20 text-white font-bold px-6 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-white/40 font-black text-[10px] uppercase tracking-widest ml-1">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="rounded-2xl h-14 border-none bg-black/20 text-white font-bold px-6 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-white/40 font-black text-[10px] uppercase tracking-widest ml-1">Senha</Label>
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="rounded-2xl h-14 border-none bg-black/20 text-white font-bold px-6 focus-visible:ring-primary" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-[1.8rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tight mt-4" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'CRIAR MINHA CONTA'}
            </Button>
            
            <div className="relative flex items-center justify-center my-8">
                <Separator className="bg-white/5" />
                <span className="absolute bg-card px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Ou</span>
            </div>

            <Button variant="outline" className="w-full rounded-2xl h-14 border-white/5 font-black text-xs uppercase tracking-widest hover:bg-white/5 text-white bg-black/20 shadow-xl" type="button" disabled={isLoading}>
                <GoogleIcon className="mr-3 h-5 w-5" />
                Continuar com Google
            </Button>
        </form>
        </AuthCard>
    );
}
