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
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Enviar Link
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="underline text-muted-foreground">
          Voltar para o login
        </Link>
      </div>
    </AuthCard>
  );
}
