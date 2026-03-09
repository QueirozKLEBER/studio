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
    description: 'Experimente o MFIT e dê os primeiros passos.',
    icon: Zap,
    features: [
      'Acesso aos treinos básicos',
      'Assistente IA limitado',
      'Blog informativo',
    ],
    cta: 'Começar Agora',
    isPremium: false,
    color: 'text-primary'
  },
  {
    name: 'Premium',
    price: 'R$ 49,90',
    description: 'A experiência completa para resultados reais.',
    icon: Star,
    features: [
      'Tudo do Plano Gratuito',
      'Treinos 100% Personalizados',
      'Assistente IA Ilimitado',
      'Avaliação Física Completa',
      'Gráficos de Evolução',
    ],
    cta: 'Assinar Premium',
    isPremium: true,
    color: 'text-primary'
  },
  {
    name: 'Personal',
    price: 'R$ 149,90',
    description: 'Acompanhamento VIP com personal trainer.',
    icon: ShieldCheck,
    features: [
      'Tudo do Plano Premium',
      'Suporte via Chat 24/7',
      'Ajustes de treino semanais',
      'Plano alimentar sugerido',
      'Chamada mensal com personal',
    ],
    cta: 'Falar com Consultor',
    isPremium: false,
    color: 'text-primary'
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8 pb-20 max-w-full overflow-x-hidden">
      <PageHeader
        title="Nossos Planos"
        subtitle="Escolha o nível de suporte ideal para o seu objetivo de elite."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col relative transition-all hover:scale-[1.02] bg-card overflow-hidden",
            plan.isPremium ? "ring-2 ring-primary/50 border-primary/20" : ""
          )}>
            {plan.isPremium && (
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Mais Recomendado
              </div>
            )}
            
            <CardHeader className="text-center pt-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <plan.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-black font-headline text-white uppercase tracking-tight">{plan.name}</CardTitle>
              <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center flex-grow px-8">
              <div className="mb-10 text-center">
                <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                <span className="text-xs font-black text-primary uppercase ml-2 tracking-widest">/mês</span>
              </div>
              
              <ul className="space-y-5 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary stroke-[3px]" />
                    </div>
                    <span className="text-sm font-bold text-white/70 uppercase tracking-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-8">
              <Button className={cn(
                "w-full rounded-[1.5rem] h-14 font-black text-lg shadow-xl transition-all active:scale-95 uppercase tracking-widest",
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
  );
}
