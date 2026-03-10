
'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, limit, Timestamp } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Dumbbell, 
  TrendingUp, 
  CreditCard, 
  History, 
  ShieldCheck, 
  ShieldBan, 
  Scale, 
  Calendar,
  Save,
  Loader2,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

function StudentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studentRef = useMemoFirebase(() => id ? doc(db, 'users', id) : null, [db, id]);
  const measurementsQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'bodyMeasurements'), orderBy('createdAt', 'asc')) : null, [db, id]);
  const workoutHistoryQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc'), limit(50)) : null, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: measurements } = useCollection(measurementsQuery);
  const { data: history } = useCollection(workoutHistoryQuery);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!studentRef) return;
    setIsUpdating(true);
    try {
      await updateDoc(studentRef, { status: newStatus });
      toast({ title: newStatus === 'active' ? "Acesso Liberado! ✅" : "Acesso Bloqueado! 🚫" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao atualizar permissão" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!studentRef || !student) return;
    setIsUpdating(true);
    try {
      // Renova o vencimento para 30 dias a partir de hoje
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + 30);
      
      await updateDoc(studentRef, {
        paymentDueDate: nextDue.toISOString().split('T')[0],
        status: 'active'
      });
      
      toast({ title: "Pagamento Confirmado!", description: "Acesso renovado por 30 dias." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao confirmar pagamento" });
    } finally {
      setIsUpdating(false);
    }
  };

  const reportStats = useMemo(() => {
    if (!history) return { totalTime: 0, sessionsWeek: 0, completionRate: 0 };
    
    const totalTime = history.reduce((acc, h) => acc + (Number(h.duration) || 0), 0);
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    const sessionsWeek = history.filter(h => h.completedAt?.toDate() >= weekAgo).length;
    
    return { totalTime, sessionsWeek };
  }, [history]);

  const chartData = useMemo(() => {
    if (!measurements) return [];
    return measurements.map(m => ({
      date: m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '...',
      weight: m.weight
    }));
  }, [measurements]);

  if (!mounted || isLoading) return <div className="p-8 animate-pulse bg-background h-screen" />;
  if (!student) return <div className="p-8 text-center py-20 text-white font-black uppercase">Aluno não encontrado.</div>;

  const isExpired = student.paymentDueDate && new Date(student.paymentDueDate) < new Date();

  return (
    <div className="flex flex-col gap-8 w-full pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader title={student.fullName || 'Atleta'} subtitle="Gestão técnica, financeira e análise de performance." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Lateral: Resumo */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-4xl font-black text-primary mb-6 shadow-2xl">
                {student.firstName?.[0]}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{student.fullName}</h3>
              <div className="flex flex-col gap-1 mt-2 mb-6">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Mail className="h-3 w-3" /> {student.email}
                </p>
                {student.phone && (
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Phone className="h-3 w-3" /> {student.phone}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Peso Atual</p>
                  <p className="text-xl font-black text-white">{student.weight || '--'} kg</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Status</p>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase mt-1",
                    isExpired ? "border-primary text-primary" : "border-green-500/30 text-green-500"
                  )}>
                    {isExpired ? 'INADIMPLENTE' : 'EM DIA'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Ações Rápidas</h4>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-14 rounded-2xl bg-primary font-black uppercase shadow-lg shadow-primary/20">
                <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                  <Dumbbell className="mr-2 h-5 w-5" /> MONTAR TREINO
                </Link>
              </Button>
              {student.status === 'blocked' || isExpired ? (
                <Button onClick={() => handleUpdateStatus('active')} variant="outline" className="w-full h-14 rounded-2xl border-green-500/30 text-green-500 font-black uppercase hover:bg-green-500/10">
                  <ShieldCheck className="mr-2 h-5 w-5" /> LIBERAR ACESSO
                </Button>
              ) : (
                <Button onClick={() => handleUpdateStatus('blocked')} variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white/40 font-black uppercase hover:bg-primary/10 hover:text-primary">
                  <ShieldBan className="mr-2 h-5 w-5" /> BLOQUEAR ALUNO
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna Principal: Abas */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="bg-white/5 p-1.5 rounded-2xl h-16 w-full border border-white/5 gap-1 mb-8">
              <TabsTrigger value="report" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <Activity className="mr-2 h-4 w-4" /> Relatório
              </TabsTrigger>
              <TabsTrigger value="evolution" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <TrendingUp className="mr-2 h-4 w-4" /> Evolução
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <CreditCard className="mr-2 h-4 w-4" /> Financeiro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="report" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-[2rem] bg-card border border-white/5 p-6 flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tempo Total de Treino</p>
                    <p className="text-2xl font-black text-white">{reportStats.totalTime} <span className="text-xs">min</span></p>
                  </div>
                </Card>
                <Card className="rounded-[2rem] bg-card border border-white/5 p-6 flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-green-500/10 text-green-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Frequência Semanal</p>
                    <p className="text-2xl font-black text-white">{reportStats.sessionsWeek} <span className="text-xs">sessões</span></p>
                  </div>
                </Card>
              </div>

              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                  <CardTitle className="text-sm font-black uppercase text-white">Últimas Atividades</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {history && history.length > 0 ? (
                    history.map(log => (
                      <div key={log.id} className="p-6 flex items-center justify-between border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase text-sm">{log.planName || 'Treino'}</p>
                            <p className="text-[10px] font-bold text-white/20 uppercase">{log.completedAt?.toDate().toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[8px]">
                          {log.duration} MIN
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-white/20 uppercase font-black text-[10px] tracking-widest italic">Nenhum treino realizado ainda.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolution">
              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 pb-4">
                  <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                    <Scale className="h-6 w-6 text-primary" /> Curva de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[350px]">
                  {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" />
                        <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid #333' }} />
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-4">
                      <TrendingUp className="h-12 w-12" />
                      <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Sem registros de medidas suficientes para gerar o gráfico.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8">
                  <CardTitle className="text-xl font-black uppercase text-white">Configurações de Faturamento</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-white/40 uppercase">Ajuste valores e valide pagamentos.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Próximo Vencimento</Label>
                      <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 font-black text-white">
                        {student.paymentDueDate ? new Date(student.paymentDueDate).toLocaleDateString('pt-BR') : 'NÃO DEFINIDO'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Valor Mensal (R$)</Label>
                      <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 font-black text-white">
                        R$ {Number(student.monthlyFee || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6",
                    isExpired ? "bg-primary/10 border border-primary/20" : "bg-green-500/10 border border-green-500/20"
                  )}>
                    <div className="flex items-center gap-4 text-center md:text-left">
                      {isExpired ? <AlertTriangle className="h-8 w-8 text-primary" /> : <ShieldCheck className="h-8 w-8 text-green-500" />}
                      <div>
                        <p className="font-black text-white uppercase tracking-tight">Status da Assinatura</p>
                        <p className={cn("text-xs font-bold uppercase", isExpired ? "text-primary" : "text-green-500")}>
                          {isExpired ? 'PAGAMENTO EM ATRASO' : 'MENSALIDADE EM DIA'}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleConfirmPayment} className="w-full md:w-auto h-14 px-8 font-black bg-white text-black hover:bg-white/90 shadow-xl rounded-2xl" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <CreditCard className="mr-2 h-5 w-5" />} CONFIRMAR RECEBIMENTO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailsPage() {
  return <Suspense fallback={<div className="p-8 animate-pulse bg-background h-screen" />}><StudentDetailsContent /></Suspense>;
}
