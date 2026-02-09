'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Calculator, TrendingUp } from 'lucide-react';

export default function AssessmentPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const val = w / (h * h);
      setBmi(val);
    }
  };

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do peso', color: 'bg-blue-500' };
    if (val < 25) return { label: 'Ideal', color: 'bg-green-500' };
    if (val < 30) return { label: 'Sobrepeso', color: 'bg-yellow-500' };
    return { label: 'Obesidade', color: 'bg-red-500' };
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Avaliação Física" 
        subtitle="Monitore sua evolução corporal com precisão." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculadora de IMC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="175" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="75" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input 
                id="age" 
                type="number" 
                placeholder="25" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Button onClick={calculateBMI} className="w-full rounded-2xl font-bold">
              Calcular Resultados
            </Button>
          </CardContent>
        </Card>

        {bmi && (
          <Card className="rounded-3xl shadow-md border-none bg-primary text-primary-foreground animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Seus Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-black">{bmi.toFixed(1)}</span>
                <p className="text-sm text-primary-foreground/80 mt-1 uppercase tracking-widest font-bold">
                  Seu IMC Atual
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Classificação</span>
                  <Badge variant="secondary" className={`${getBmiStatus(bmi).color} text-white border-none`}>
                    {getBmiStatus(bmi).label}
                  </Badge>
                </div>
                <Progress value={(bmi / 40) * 100} className="h-3 bg-white/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-70">Gordura Estimada</p>
                  <p className="text-xl font-bold">14.2%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold opacity-70">Massa Magra</p>
                  <p className="text-xl font-bold">64.5kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold px-1">Dicas do Personal</h3>
        <Card className="rounded-3xl border-none shadow-sm bg-white p-4 flex gap-4 items-center">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">Mantenha a constância!</p>
            <p className="text-xs text-muted-foreground">Medições mensais ajudam a identificar padrões de progresso real.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}