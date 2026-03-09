'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Check, Star, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0,00',
    description: 'Dê os primeiros passos.',
    icon: Zap,
    features: [
      'Acesso aos treinos básicos',
      'Assistente IA limitado',
      'Blog informativo',
    ],
    cta: 'Começar Agora',
    isPremium: false,
  },
  {
    name: 'Premium',
    price: 'R$ 49,90',
    description: 'Resultados reais.',
    icon: Star,
    features: [
      'Tudo do Plano Gratuito',
      'Treinos Personalizados',
      'Assistente IA Ilimitado',
      'Avaliação Física',
      'Evolução em Gráficos',
    ],
    cta: 'Assinar Premium',
    isPremium: true,
  },
  {
    name: 'Personal',
    price: 'R$ 149,90',
    description: 'Acompanhamento VIP.',
    icon: ShieldCheck,
    features: [
      'Tudo do Plano Premium',
      'Suporte via Chat 24/7',
      'Ajustes de treino',
      'Plano alimentar',
      'Chamada mensal',
    ],
    cta: 'Falar com Consultor',
    isPremium: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8 pb-20 max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full px-4">
        <PageHeader
          title="Nossos Planos"
          subtitle="Escolha o nível de suporte ideal para o seu objetivo de elite."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 items-start">
          {plans.map((plan) => (
            <Card key={plan.name} className={cn(
              "rounded-[2rem] border border-white/5 shadow-2xl flex flex-col relative transition-all hover:scale-[1.02] bg-card overflow-hidden",
              plan.isPremium ? "ring-2 ring-primary/50 border-primary/20 scale-105 z-10 md:mt-[-10px]" : "opacity-90"
            )}>
              {plan.isPremium && (
                <div className="absolute top-0 right-0 left-0 flex justify-center">
                  <div className="bg-primary text-white px-4 py-1 rounded-b-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                    Recomendado
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pt-8 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-black font-headline text-white uppercase tracking-tight">{plan.name}</CardTitle>
                <CardDescription className="text-white/40 font-bold uppercase text-[9px] tracking-widest mt-1">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center flex-grow px-6">
                <div className="mb-6 text-center">
                  <span className="text-3xl font-black text-white tracking-tighter">{plan.price}</span>
                  <span className="text-[10px] font-black text-primary uppercase ml-1 tracking-widest">/mês</span>
                </div>
                
                <ul className="space-y-3 w-full mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-primary stroke-[4px]" />
                      </div>
                      <span className="text-[11px] font-bold text-white/70 uppercase tracking-tight leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-2">
                <Button className={cn(
                  "w-full rounded-xl h-12 font-black text-xs shadow-xl transition-all active:scale-95 uppercase tracking-widest",
                  plan.isPremium 
                    ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                    : "bg-white/5 text-white border-2 border-white/10 hover:bg-white/10"
                )}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
