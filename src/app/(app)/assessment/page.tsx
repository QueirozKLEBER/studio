
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Calculator, 
  TrendingUp, 
  History, 
  Plus, 
  Loader2, 
  Scale, 
  Ruler,
  Calendar,
  Zap,
  Info,
  ChevronRight,
  ChevronLeft
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

// Componente da Ilustração do Corpo
const BodyMap = ({ data }: { data: any }) => {
  if (!data) return null;

  const Label = ({ title, sub, pos }: { title: string, sub: string, pos: string }) => (
    <div className={cn("absolute flex flex-col items-center text-center", pos)}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
        <span className="text-[10px] font-black text-white leading-none">{title}</span>
      </div>
      <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
        <p className="text-[11px] font-black text-primary leading-none">{data[`${sub}Fat`]}% <span className="text-[8px] text-white/40">G</span></p>
        <p className="text-[11px] font-black text-green-500 leading-none mt-0.5">{data[`${sub}Muscle`]}% <span className="text-[8px] text-white/40">M</span></p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-[3/4] flex items-center justify-center">
      {/* Silhueta SVG */}
      <svg viewBox="0 0 200 300" className="w-full h-full text-white/5 drop-shadow-2xl">
        <path fill="currentColor" d="M100,20 c-10,0-15,10-15,20s5,20,15,20s15-10,15-20S110,20,100,20z M85,65 c-10,0-20,5-25,15 c-5,10-5,30-5,40s0,50,5,60c2,5,5,10,10,10h5v80c0,5,5,10,10,10s10-5,10-10v-80h10v80c0,5,5,10,10,10s10-5,10-10v-80h5 c5,0,8-5,10-10c5-10,5-50,5-60s0-30-5-40C120,70,110,65,100,65H85z" />
      </svg>

      {/* Labels de Segmentos baseados na imagem de referência */}
      <Label title="Braço Esq" sub="lArm" pos="top-[25%] left-0" />
      <Label title="Braço Dir" sub="rArm" pos="top-[25%] right-0" />
      <Label title="Tronco" sub="trunk" pos="top-[45%] left-[-10px]" />
      <Label title="Perna Esq" sub="lLeg" pos="bottom-[15%] left-0" />
      <Label title="Perna Dir" sub="rLeg" pos="bottom-[15%] right-0" />

      {/* Indicadores L/R na base */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-12">
        <span className="text-[10px] font-black text-white/20 uppercase italic">L</span>
        <span className="text-[10px] font-black text-white/20 uppercase italic">R</span>
      </div>
    </div>
  );
};

export default function AssessmentPage() {
  const { user, profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [height, setHeight] = useState(profile?.height || '');
  const [weight, setWeight] = useState(profile?.weight || '');
  const [bmi, setBmi] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeBioIndex, setActiveBioIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca histórico de medidas (Peso/IMC)
  const measurementsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'bodyMeasurements'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  // Busca histórico de Bioimpedância
  const bioQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'bioimpedance'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: history, isLoading: isHistoryLoading } = useCollection(measurementsQuery);
  const { data: bioReports, isLoading: isBioLoading } = useCollection(bioQuery);

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
    return history.slice().reverse().map(m => ({
      date: m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '...',
      weight: m.weight,
      bmi: m.bmi
    }));
  }, [history, mounted]);

  if (!mounted) return <div className="p-8 animate-pulse bg-background h-screen" />;

  const currentBio = bioReports && bioReports[activeBioIndex] ? bioReports[activeBioIndex] : null;

  return (
    <div className="flex flex-col gap-8 pb-24 max-w-full overflow-x-hidden">
      <PageHeader 
        title="Avaliação Física" 
        subtitle="Monitore sua evolução corporal e histórico de medidas." 
      />

      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="bg-card border border-white/5 p-1 rounded-2xl h-14 gap-1 mb-8">
          <TabsTrigger value="bio" className="flex-1 rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-primary">
            <Zap className="h-4 w-4 mr-2" /> Bioimpedância Elite
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1 rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-primary">
            <Scale className="h-4 w-4 mr-2" /> Peso e IMC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bio" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Ilustração Corporal */}
            <Card className="lg:col-span-7 rounded-[2.5rem] bg-[#1a1d24] border border-white/5 shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative">
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
              <CardHeader className="bg-white/5 p-8 border-b border-white/5 z-10 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase text-white tracking-tighter">Composição Corporal</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-white/20 uppercase">Distribuição segmentada de gordura e músculo.</CardDescription>
                </div>
                {currentBio && (
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">
                    {currentBio.createdAt?.toDate().toLocaleDateString('pt-BR')}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                {isBioLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : currentBio ? (
                  <div className="w-full space-y-12">
                    <div className="text-center">
                      <p className="text-7xl font-black text-white tracking-tighter">{currentBio.weight}<span className="text-xl ml-1 text-primary">kg</span></p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Massa Corporal Total</p>
                    </div>
                    
                    <BodyMap data={currentBio} />

                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] font-black text-white/40 uppercase mb-1">Gordura Corporal</p>
                        <p className="text-2xl font-black text-primary">{currentBio.fatTotal}%</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[9px] font-black text-white/40 uppercase mb-1">Massa Muscular</p>
                        <p className="text-2xl font-black text-green-500">{currentBio.muscleTotal}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-20">
                    <Scale className="h-20 w-20 mx-auto mb-6" />
                    <p className="font-black uppercase text-sm italic">Aguardando seu professor realizar a bioimpedância.</p>
                  </div>
                )}
              </CardContent>

              {bioReports && bioReports.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center justify-between z-20">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={activeBioIndex === bioReports.length - 1}
                    onClick={() => setActiveBioIndex(i => i + 1)}
                    className="h-12 w-12 rounded-full bg-white/5 text-white disabled:opacity-10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <span className="text-[9px] font-black text-white/20 uppercase">Exame {activeBioIndex + 1} de {bioReports.length}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={activeBioIndex === 0}
                    onClick={() => setActiveBioIndex(i => i - 1)}
                    className="h-12 w-12 rounded-full bg-white/5 text-white disabled:opacity-10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </Card>

            {/* Dicas e Legendda */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 p-8 shadow-xl">
                <CardTitle className="text-sm font-black uppercase text-primary mb-6 tracking-widest flex items-center gap-2">
                  <Info className="h-4 w-4" /> Legenda Técnica
                </CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <p className="text-[10px] font-bold text-white/60 uppercase">Taxa Padrão de Gordura (Segmentada)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <p className="text-[10px] font-bold text-white/60 uppercase">Rácio Padrão Muscular (Segmentado)</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2.5rem] bg-primary text-white p-8 shadow-2xl relative overflow-hidden">
                <Zap className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">Análise do Personal</h4>
                <p className="text-sm font-bold leading-relaxed text-white/80">
                  "Sua simetria entre membros está excelente. O foco agora deve ser reduzir a gordura no tronco mantendo a massa magra nas pernas."
                </p>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-primary" /> Nova Medição
                  </CardTitle>
                  <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Calcule seu IMC e salve seu progresso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="font-black text-[10px] uppercase text-white/40 tracking-widest">Altura (cm)</Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-xl h-12 pl-10 border-none bg-white/5 text-white font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="font-black text-[10px] uppercase text-white/40 tracking-widest">Peso (kg)</Label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl h-12 pl-10 border-none bg-white/5 text-white font-bold" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={calculateBMI} className="flex-1 rounded-2xl h-14 font-black text-lg bg-primary text-white shadow-xl uppercase">CALCULAR IMC</Button>
                    {bmi && (
                      <Button onClick={handleRegister} disabled={isSaving} variant="outline" className="flex-1 rounded-2xl h-14 font-black text-lg border-2 border-white/10 text-white uppercase">
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 mr-2 text-primary" />} REGISTRAR
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {bmi && (
                <Card className="rounded-[2.5rem] border-none shadow-2xl bg-primary text-white p-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center">
                    <span className="text-7xl font-black tracking-tighter">{bmi.toFixed(1)}</span>
                    <p className="text-[10px] text-white/60 mt-2 uppercase tracking-[0.3em] font-black italic">Índice de Massa Corporal</p>
                  </div>
                  <div className="mt-8 flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-widest">Seu Status</span>
                    <Badge className={cn(getBmiStatus(bmi).color, "text-white border-none font-black uppercase text-[10px] px-4 py-1.5")}>{getBmiStatus(bmi).label}</Badge>
                  </div>
                </Card>
              )}
            </div>

            <Card className="lg:col-span-7 rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden h-full">
              <CardHeader className="bg-white/5 p-8 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-2"><Activity className="h-6 w-6 text-primary" /> Evolução do Peso</CardTitle>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary font-black uppercase text-[10px]">ANALÍTICO</Badge>
              </CardHeader>
              <CardContent className="h-[400px] p-8">
                {isHistoryLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                ) : chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" dy={10} />
                      <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '24px', border: '1px solid rgba(255,0,0,0.2)' }} />
                      <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={5} dot={{ r: 6, fill: "hsl(var(--primary))", stroke: "#1a1a1a" }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-4">
                    <Scale className="h-16 w-16" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Registre pelo menos duas medições para o gráfico.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
