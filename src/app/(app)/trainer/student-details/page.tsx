
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, serverTimestamp, where, limit } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Dumbbell, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  History, 
  ShieldCheck, 
  ShieldBan, 
  Scale, 
  Ruler,
  Calendar,
  Save,
  Loader2,
  AlertTriangle,
  Mail,
  Phone
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

  // Queries
  const studentRef = useMemoFirebase(() => id ? doc(db, 'users', id) : null, [db, id]);
  const measurementsQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'bodyMeasurements'), orderBy('createdAt', 'asc')) : null, [db, id]);
  const workoutHistoryQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc'), limit(20)) : null, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: measurements } = useCollection(measurementsQuery);
  const { data: history } = useCollection(workoutHistoryQuery);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!studentRef) return;
    setIsUpdating(true);
    try {
      await updateDoc(studentRef, { status: newStatus });
      toast({ title: "Status atualizado" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao atualizar" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFinancial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentRef) return;
    const formData = new FormData(e.currentTarget);
    setIsUpdating(true);
    try {
      await updateDoc(studentRef, {
        paymentDueDate: formData.get('paymentDueDate'),
        monthlyFee: parseFloat(formData.get('monthlyFee') as string),
        status: 'active'
      });
      toast({ title: "Financeiro atualizado!", description: "Acesso liberado automaticamente." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar" });
    } finally {
      setIsUpdating(false);
    }
  };

  const chartData = useMemo(() => {
    if (!measurements) return [];
    return measurements.map(m => ({
      date: m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '...',
      weight: m.weight
    }));
  }, [measurements]);

  if (isLoading) return <div className="p-8 animate-pulse bg-background h-screen" />;
  if (!student) return <div className="p-8 text-center py-20 text-white font-black uppercase">Aluno não encontrado.</div>;

  const isExpired = student.paymentDueDate && new Date(student.paymentDueDate) < new Date();

  return (
    <div className="flex flex-col gap-8 w-full pb-20 max-w-6xl mx-auto px-1">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader title={student.fullName} subtitle="GESTÃO TÉCNICA E EVOLUÇÃO." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Perfil e Ações Rápidas */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-4xl font-black text-primary mb-6 shadow-2xl">
                {student.firstName?.[0]}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{student.fullName}</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 mb-6">{student.email}</p>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Peso Atual</p>
                  <p className="text-xl font-black text-white">{student.weight || '--'} kg</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Altura</p>
                  <p className="text-xl font-black text-white">{student.height || '--'} cm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-card border border-white/5 shadow-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Ações de Controle</h4>
            <div className="flex flex-col gap-3">
              {student.status === 'blocked' ? (
                <Button onClick={() => handleUpdateStatus('active')} className="w-full h-14 rounded-2xl bg-green-600 font-black uppercase shadow-lg shadow-green-900/20" disabled={isUpdating}>
                  <ShieldCheck className="mr-2 h-5 w-5" /> LIBERAR ACESSO
                </Button>
              ) : (
                <Button onClick={() => handleUpdateStatus('blocked')} variant="destructive" className="w-full h-14 rounded-2xl font-black uppercase shadow-lg shadow-red-900/20" disabled={isUpdating}>
                  <ShieldBan className="mr-2 h-5 w-5" /> BLOQUEAR ACESSO
                </Button>
              )}
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all">
                <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                  <Dumbbell className="mr-2 h-5 w-5" /> ATUALIZAR TREINO
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* Detalhes e Métricas */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="evolution" className="w-full">
            <TabsList className="bg-white/5 p-1.5 rounded-2xl h-16 w-full border border-white/5 gap-1 mb-8">
              <TabsTrigger value="evolution" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <TrendingUp className="mr-2 h-4 w-4" /> Evolução
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <CreditCard className="mr-2 h-4 w-4" /> Financeiro
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 font-black text-[10px] uppercase h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <History className="mr-2 h-4 w-4" /> Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evolution" className="space-y-6">
              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 pb-4">
                  <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                    <Scale className="h-6 w-6 text-primary" /> Curva de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[300px]">
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
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <TrendingUp className="h-12 w-12 mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sem registros suficientes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8">
                  <CardTitle className="text-xl font-black uppercase text-white">Controle de Mensalidade</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-white/40 uppercase">Gerencie valores e vencimentos.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleUpdateFinancial} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Vencimento da Mensalidade</Label>
                        <Input name="paymentDueDate" type="date" defaultValue={student.paymentDueDate || ''} className="rounded-xl h-14 bg-white/5 border-none font-black text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Valor Mensal (R$)</Label>
                        <Input name="monthlyFee" type="number" step="0.01" defaultValue={student.monthlyFee || 0} className="rounded-xl h-14 bg-white/5 border-none font-black text-white" />
                      </div>
                    </div>

                    <div className={cn(
                      "p-6 rounded-3xl flex items-center justify-between",
                      isExpired ? "bg-primary/10 border border-primary/20" : "bg-green-500/10 border border-green-500/20"
                    )}>
                      <div className="flex items-center gap-4">
                        {isExpired ? <AlertTriangle className="h-8 w-8 text-primary" /> : <ShieldCheck className="h-8 w-8 text-green-500" />}
                        <div>
                          <p className="font-black text-white uppercase tracking-tight">Status de Acesso</p>
                          <p className={cn("text-sm font-bold uppercase", isExpired ? "text-primary" : "text-green-500")}>
                            {isExpired ? 'PAGAMENTO VENCIDO - ACESSO RESTRITO' : 'REGULARIZADO - ACESSO LIBERADO'}
                          </p>
                        </div>
                      </div>
                      <Button type="submit" className="rounded-2xl h-14 px-8 font-black bg-white text-black hover:bg-white/90 shadow-xl" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-5 w-5" />} SALVAR
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="rounded-[2.5rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {history && history.length > 0 ? (
                      history.map((log) => (
                        <div key={log.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <History className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{log.planName || 'Treino'}</p>
                              <p className="text-[10px] font-bold text-white/40 uppercase">
                                Concluído em {log.completedAt?.toDate().toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-green-500/30 text-green-500 font-black text-[8px] uppercase">
                            {log.duration} MIN
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-20 text-center opacity-20 italic font-black uppercase text-xs tracking-widest">Nenhuma atividade registrada.</div>
                    )}
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
