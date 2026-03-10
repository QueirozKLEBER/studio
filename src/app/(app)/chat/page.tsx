'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ChatRedirectPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const trainerRef = useMemoFirebase(() => {
    if (!profile?.trainerId) return null;
    return doc(db, 'users', profile.trainerId);
  }, [db, profile?.trainerId]);

  const { data: trainer, isLoading } = useDoc(trainerRef);

  useEffect(() => {
    if (!isLoading && trainer) {
      if (trainer.phone) {
        const phone = trainer.phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Olá Professor ${trainer.firstName}, tenho uma dúvida sobre meu treino no TreinusFit!`);
        window.location.href = `https://wa.me/55${phone}?text=${message}`;
      } else {
        setError('O seu professor ainda não cadastrou um número de WhatsApp para contato.');
      }
    } else if (!isLoading && !profile?.trainerId) {
      setError('Você ainda não possui um professor vinculado para iniciar um chat.');
    }
  }, [trainer, isLoading, profile]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-6 text-center">
      <PageHeader 
        title="Chat Direto" 
        subtitle="Conectando você ao WhatsApp do seu Professor de Elite." 
      />

      <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl max-w-sm w-full">
        <CardContent className="p-10 flex flex-col items-center gap-6">
          {isLoading ? (
            <>
              <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center animate-pulse">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-black uppercase text-white tracking-tight">Localizando Professor...</p>
                <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
              </div>
            </>
          ) : error ? (
            <>
              <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>
              <p className="text-xs font-bold text-white/60 uppercase leading-relaxed italic">
                {error}
              </p>
              <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-white/10 text-white font-black uppercase text-[10px]">
                <ArrowLeft className="mr-2 h-4 w-4" /> VOLTAR
              </Button>
            </>
          ) : (
            <>
              <div className="h-20 w-20 rounded-[2rem] bg-green-500/10 flex items-center justify-center animate-bounce">
                <MessageCircle className="h-10 w-10 text-green-500" />
              </div>
              <p className="font-black uppercase text-white tracking-tight">Redirecionando para o WhatsApp...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
