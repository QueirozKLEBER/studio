
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { CreditCard, Calendar, Copy, CheckCircle2, AlertTriangle, MessageCircle, Wallet, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca o perfil do professor para pegar a chave PIX e Telefone
  const trainerRef = useMemoFirebase(() => {
    if (!profile?.trainerId) return null;
    return doc(db, 'users', profile.trainerId);
  }, [db, profile?.trainerId]);

  const { data: trainer } = useDoc(trainerRef);

  const isExpired = useMemo(() => {
    if (!profile?.paymentDueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(profile.paymentDueDate) < today;
  }, [profile]);

  const handleCopyPix = () => {
    if (!trainer?.pixKey) return;
    navigator.clipboard.writeText(trainer.pixKey);
    toast({
      title: "Chave PIX Copiada! 📋",
      description: "Agora é só colar no app do seu banco.",
    });
  };

  const handleWhatsAppNotify = () => {
    if (!trainer?.phone) {
      toast({ variant: 'destructive', title: 'Erro', description: 'WhatsApp do professor não cadastrado.' });
      return;
    }
    const message = encodeURIComponent(`Olá Professor ${trainer.firstName}, acabei de realizar o pagamento da minha mensalidade (Aluno: ${profile?.firstName} ${profile?.lastName}). Segue o comprovante abaixo!`);
    const phone = trainer.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto w-full px-1">
      <PageHeader 
        title="Financeiro" 
        subtitle="Gerencie sua assinatura e mantenha seu acesso de elite em dia." 
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Status da Assinatura */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <Card className={cn(
            "rounded-[2.5rem] border-none shadow-2xl overflow-hidden",
            isExpired ? "bg-primary text-white" : "bg-card border border-white/5"
          )}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className={cn(
                  "p-3 rounded-2xl shadow-lg",
                  isExpired ? "bg-white/20" : "bg-primary/10 text-primary"
                )}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <Badge className={cn(
                  "font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-lg",
                  isExpired ? "bg-white text-primary" : "bg-green-500 text-white"
                )}>
                  {isExpired ? 'VENCIDO' : 'ATIVO'}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight mt-6">Minha Mensalidade</CardTitle>
              <CardDescription className={cn(
                "font-bold uppercase text-[10px] tracking-widest",
                isExpired ? "text-white/60" : "text-white/40"
              )}>
                {isExpired ? 'Regularize agora para liberar seus treinos.' : 'Sua conta está em dia com o sistema.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
              <div className="space-y-1">
                <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isExpired ? "text-white/40" : "text-white/20")}>Próximo Vencimento</p>
                <div className="flex items-center gap-3">
                  <Calendar className={cn("h-5 w-5", isExpired ? "text-white" : "text-primary")} />
                  <span className="text-3xl font-black tracking-tighter">
                    {profile?.paymentDueDate ? new Date(profile.paymentDueDate).toLocaleDateString('pt-BR') : 'NÃO DEFINIDO'}
                  </span>
                </div>
              </div>

              {isExpired && (
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-white shrink-0" />
                  <p className="text-[10px] font-bold leading-relaxed uppercase">
                    Seu acesso foi bloqueado automaticamente. Realize o PIX abaixo para solicitar o desbloqueio ao seu professor.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-white/5 border border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Professor Responsável</p>
                <p className="text-sm font-black text-white uppercase">{trainer?.firstName ? `Prof. ${trainer.firstName}` : 'Aguardando Atribuição'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Área de Pagamento */}
        <div className="md:col-span-7 space-y-6">
          <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl h-full flex flex-col">
            <CardHeader className="bg-white/5 border-b border-white/5 p-8">
              <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                <Wallet className="h-6 w-6 text-primary" />
                Pagamento via PIX
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Utilize os dados abaixo para realizar a transferência.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Chave PIX do Professor</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 font-black text-white text-lg tracking-tight truncate">
                      {trainer?.pixKey || 'CHAVE NÃO CADASTRADA'}
                    </div>
                    {trainer?.pixKey && (
                      <Button onClick={handleCopyPix} className="h-auto px-6 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                        <Copy className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                  <h4 className="font-black text-primary flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                    <CheckCircle2 className="h-4 w-4" />
                    Como funciona?
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-bold">
                    1. Copie a chave PIX acima.<br />
                    2. Faça o pagamento no app do seu banco.<br />
                    3. Clique no botão abaixo para avisar seu professor.
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleWhatsAppNotify}
                disabled={!trainer?.phone}
                className="w-full h-20 rounded-[2rem] bg-green-600 hover:bg-green-500 text-white font-black text-lg shadow-xl shadow-green-900/20 uppercase tracking-tight transition-all active:scale-95 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                  <span>AVISAR PAGAMENTO NO WHATSAPP</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
