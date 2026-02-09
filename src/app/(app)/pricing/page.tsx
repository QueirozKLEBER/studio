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
    color: 'text-gray-500'
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
    color: 'text-secondary'
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader
        title="Nossos Planos"
        subtitle="Escolha o nível de suporte ideal para o seu objetivo."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "rounded-[2.5rem] border-none shadow-md flex flex-col relative transition-transform hover:scale-[1.02]",
            plan.isPremium ? "bg-primary text-primary-foreground shadow-xl ring-4 ring-primary/20" : "bg-white"
          )}>
            {plan.isPremium && (
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Mais Recomendado
              </div>
            )}
            <CardHeader className="text-center pt-8">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4",
                plan.isPremium ? "bg-white/20" : "bg-blue-50"
              )}>
                <plan.icon className={cn("h-6 w-6", plan.isPremium ? "text-white" : plan.color)} />
              </div>
              <CardTitle className="text-2xl font-bold font-headline">{plan.name}</CardTitle>
              <CardDescription className={plan.isPremium ? "text-primary-foreground/70" : ""}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center flex-grow">
              <div className="mb-8">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className={cn("text-sm font-bold opacity-70", plan.isPremium ? "" : "text-muted-foreground")}>/mês</span>
              </div>
              <ul className="space-y-4 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
                      plan.isPremium ? "bg-white/20" : "bg-blue-50"
                    )}>
                      <Check className={cn("h-3 w-3", plan.isPremium ? "text-white" : "text-primary")} />
                    </div>
                    <span className={cn("text-sm font-medium", plan.isPremium ? "" : "text-muted-foreground")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pb-8">
              <Button className={cn(
                "w-full rounded-2xl h-12 font-bold shadow-lg transition-transform active:scale-95",
                plan.isPremium ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
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