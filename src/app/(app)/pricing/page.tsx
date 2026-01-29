import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Plano Básico',
    price: 'R$ 29,90',
    description: 'Ideal para quem está começando e busca autonomia.',
    features: [
      'Acesso a todos os treinos prontos',
      'Biblioteca de vídeos de exercícios',
      'Dicas alimentares',
    ],
    cta: 'Assinar Plano Básico',
    isPremium: false,
  },
  {
    name: 'Plano Premium',
    price: 'R$ 79,90',
    description: 'Para quem busca um acompanhamento mais próximo e personalizado.',
    features: [
      'Tudo do Plano Básico',
      'Treinos 100% personalizados para seus objetivos',
      'Ajustes mensais no seu plano de treino',
      'Suporte via chat para tirar dúvidas',
    ],
    cta: 'Assinar Plano Premium',
    isPremium: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Planos e Mensalidade"
        subtitle="Escolha o plano que melhor se adapta aos seus objetivos e comece a transformar seu corpo hoje mesmo."
      />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.isPremium ? 'border-primary shadow-lg' : ''}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${plan.isPremium ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <h3 className="text-xl font-headline font-semibold mb-2">Por que um Personal Trainer Online?</h3>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Com a TreinoPro, você tem a flexibilidade de treinar onde e quando quiser, com a segurança de um acompanhamento profissional. Nossos métodos são baseados em ciência para garantir que você atinja seus objetivos de forma eficiente e segura.
        </p>
      </div>
    </div>
  );
}
