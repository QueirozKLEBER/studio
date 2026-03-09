
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Calculator, 
  TrendingUp, 
  History, 
  Plus, 
  Loader2, 
  Scale, 
  Ruler,
  Calendar
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function AssessmentPage() {
  const { user, profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [height, setHeight] = useState(profile?.height || '');
  const [weight, setWeight] = useState(profile?.weight || '');
  const [bmi, setBmi] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca histórico de medidas
  const measurementsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'bodyMeasurements'),
      orderBy('createdAt', 'asc')
    );
  }, [db, user]);

  const { data: history, isLoading: isHistoryLoading } = useCollection(measurementsQuery);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const val = w / (h * h);
      setBmi(val);
    } else {
      toast({
        variant: 'destructive',
        title: 'Dados inválidos',
        description: 'Por favor, insira peso e altura válidos.',
      });
    }
  };

  const handleRegister = async () => {
    if (!user || !bmi) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'bodyMeasurements'), {
        weight: parseFloat(weight),
        height: parseFloat(height),
        bmi: parseFloat(bmi.toFixed(2)),
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Evolução Registrada! 📈',
        description: 'Suas medidas foram salvas no histórico.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível registrar as medidas agora.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do peso', color: 'bg-blue-500' };
    if (val < 25) return { label: 'Ideal', color: 'bg-green-500' };
    if (val < 30) return { label: 'Sobrepeso', color: 'bg-yellow-500' };
    return { label: 'Obesidade', color: 'bg-red-500' };
  };

  const chartData = useMemo(() => {
    if (!mounted || !history) return [];
    return history.map(m => ({
      date: m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '...',
      weight: m.weight,
      bmi: m.bmi
    }));
  }, [history, mounted]);

  if (!mounted) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-white/5 rounded-[2.5rem]" />
          <div className="h-64 bg-white/5 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24 max-w-full overflow-x-hidden">
      <PageHeader 
        title="Avaliação Física" 
        subtitle="Monitore sua evolução corporal e histórico de medidas." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calculadora e Registro */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                Nova Medição
              </CardTitle>
              <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Calcule seu IMC e salve seu progresso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="font-black text-[10px] uppercase text-white/40 tracking-widest">Altura (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="175" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-xl h-12 pl-10 border-none bg-white/5 text-white font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="font-black text-[10px] uppercase text-white/40 tracking-widest">Peso (kg)</Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="75" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-xl h-12 pl-10 border-none bg-white/5 text-white font-bold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={calculateBMI} 
                  className="flex-1 rounded-2xl h-14 font-black text-lg bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tighter"
                >
                  CALCULAR IMC
                </Button>
                {bmi && (
                  <Button 
                    onClick={handleRegister} 
                    disabled={isSaving}
                    variant="outline" 
                    className="flex-1 rounded-2xl h-14 font-black text-lg border-2 border-white/10 hover:bg-white/5 transition-all text-white uppercase tracking-tighter"
                  >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-2 text-primary" />}
                    REGISTRAR
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {bmi && (
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-primary text-white p-2 animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resultado Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center">
                  <span className="text-7xl font-black tracking-tighter">{bmi.toFixed(1)}</span>
                  <p className="text-[10px] text-white/60 mt-2 uppercase tracking-[0.3em] font-black italic">
                    Índice de Massa Corporal
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-widest">Seu Status</span>
                    <Badge className={cn(getBmiStatus(bmi).color, "text-white border-none font-black uppercase text-[10px] px-4 py-1.5 shadow-lg")}>
                      {getBmiStatus(bmi).label}
                    </Badge>
                  </div>
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-60">
                      <span>Magreza</span>
                      <span>Ideal</span>
                      <span>Obesidade</span>
                    </div>
                    <Progress value={(Math.min(bmi, 40) / 40) * 100} className="h-3 bg-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gráfico de Evolução */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between bg-white/5 p-8 pb-4">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Evolução do Peso
                </CardTitle>
                <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Histórico de performance corporal.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-xl border-primary/30 text-primary font-black uppercase tracking-widest text-[10px]">ANALÍTICO</Badge>
            </CardHeader>
            <CardContent className="h-[350px] p-8">
              {isHistoryLoading ? (
                <div className="h-full w-full flex items-center justify-center bg-black/20 rounded-3xl">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      fontSize={10} 
                      dy={10} 
                      stroke="#ffffff40"
                      fontWeight="900"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      fontSize={10} 
                      stroke="#ffffff40"
                      fontWeight="900"
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '24px', border: '1px solid rgba(255,0,0,0.2)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                      labelStyle={{ color: 'hsl(var(--primary))', fontWeight: '900', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={5} 
                      dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 3, stroke: "#1a1a1a" }}
                      activeDot={{ r: 10, shadow: '0 0 20px rgba(255,0,0,0.5)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-[2.5rem] border border-dashed border-white/5 gap-6">
                  <div className="p-6 bg-card rounded-full shadow-inner">
                    <Scale className="h-16 w-16 text-white/10" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-white/20 uppercase tracking-widest text-sm">Sem dados suficientes</p>
                    <p className="text-[10px] font-bold text-white/10 max-w-xs mx-auto uppercase tracking-tighter">
                      Registre pelo menos duas medições para visualizar o gráfico de evolução.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Histórico Recente */}
      <div className="flex flex-col gap-6 mt-4">
        <h3 className="text-xl font-black px-2 flex items-center gap-2 uppercase tracking-tight text-white">
          <History className="h-6 w-6 text-primary" />
          Medições Recentes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {history?.slice().reverse().slice(0, 4).map((m) => (
            <Card key={m.id} className="rounded-[2rem] border border-white/5 shadow-xl bg-card hover:border-primary/20 transition-all group">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-none bg-white/5 text-primary font-black text-[10px] uppercase tracking-widest">
                    IMC {m.bmi}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR') : '...'}
                  </p>
                  <p className="text-3xl font-black text-white mt-1">
                    {m.weight} <span className="text-xs font-bold text-primary italic uppercase tracking-tighter">kg</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!history || history.length === 0) && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
              <p className="font-black uppercase tracking-[0.2em] text-white/10 text-xs italic">Nenhum registro anterior disponível no sistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
