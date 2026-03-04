
'use client';

import { useState, useMemo } from 'react';
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
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
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

export default function AssessmentPage() {
  const { user, profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [height, setHeight] = useState(profile?.height || '');
  const [weight, setWeight] = useState(profile?.weight || '');
  const [bmi, setBmi] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!history) return [];
    return history.map(m => ({
      date: m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '...',
      weight: m.weight,
      bmi: m.bmi
    }));
  }, [history]);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader 
        title="Avaliação Física" 
        subtitle="Monitore sua evolução corporal e histórico de medidas." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calculadora e Registro */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                Nova Medição
              </CardTitle>
              <CardDescription>Calcule seu IMC e salve para ver no gráfico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="font-bold text-xs uppercase opacity-70">Altura (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="175" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-xl h-12 pl-10 border-none bg-muted/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="font-bold text-xs uppercase opacity-70">Peso (kg)</Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="75" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-xl h-12 pl-10 border-none bg-muted/30"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={calculateBMI} className="flex-1 rounded-2xl h-12 font-bold bg-primary text-white shadow-lg shadow-primary/20">
                  Calcular IMC
                </Button>
                {bmi && (
                  <Button 
                    onClick={handleRegister} 
                    disabled={isSaving}
                    variant="secondary" 
                    className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-secondary/20"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Registrar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {bmi && (
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground p-2 animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resultado Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center">
                  <span className="text-6xl font-black">{bmi.toFixed(1)}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2 uppercase tracking-[0.2em] font-black">
                    IMC
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                    <span className="text-sm font-bold uppercase tracking-tight">Status</span>
                    <Badge className={`${getBmiStatus(bmi).color} text-white border-none font-black uppercase text-[10px] px-3`}>
                      {getBmiStatus(bmi).label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-70">
                      <span>Abaixo</span>
                      <span>Ideal</span>
                      <span>Acima</span>
                    </div>
                    <Progress value={(Math.min(bmi, 40) / 40) * 100} className="h-4 bg-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gráfico de Evolução */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-secondary" />
                  Evolução do Peso
                </CardTitle>
                <CardDescription>Sua trajetória nos últimos registros.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-xl border-primary/20 text-primary font-bold">HISTÓRICO</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
              {isHistoryLoading ? (
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-3xl">
                  <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
                </div>
              ) : chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      fontSize={10} 
                      dy={10} 
                      fontFamily="Poppins" 
                      fontWeight="bold"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      fontSize={10} 
                      fontFamily="Poppins" 
                      fontWeight="bold"
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'black', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-[2rem] gap-4">
                  <div className="p-4 bg-white rounded-full shadow-sm">
                    <Scale className="h-10 w-10 text-muted-foreground opacity-30" />
                  </div>
                  <div>
                    <p className="font-bold text-muted-foreground uppercase tracking-tight text-sm">Nenhum dado histórico</p>
                    <p className="text-xs text-muted-foreground max-w-xs mt-2">
                      Comece a registrar suas medições para visualizar sua evolução no gráfico.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Histórico Recente */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-xl font-bold px-2 flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          Medições Recentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {history?.slice().reverse().slice(0, 4).map((m) => (
            <Card key={m.id} className="rounded-3xl border-none shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-600 border-none font-bold text-[10px]">
                    IMC {m.bmi}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR') : '...'}
                  </p>
                  <p className="text-2xl font-black text-primary">{m.weight} <span className="text-sm font-bold text-muted-foreground">kg</span></p>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!history || history.length === 0) && (
            <div className="col-span-full py-10 text-center opacity-50 italic text-sm">
              Nenhum registro anterior disponível.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
