
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
import { Textarea } from '@/components/ui/textarea';
import { useDoc, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, limit, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
  Zap,
  CheckCircle2,
  DollarSign,
  Edit2,
  Plus,
  User,
  Droplets,
  Flame,
  Dna,
  Layers,
  Utensils,
  Apple,
  ChevronRight
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
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const INITIAL_BIO_DATA = {
  date: new Date().toISOString().split('T')[0],
  weight: '',
  bmi: '',
  fatTotal: '',
  fatMass: '',
  leanMass: '',
  skeletalMuscle: '',
  muscleTotal: '',
  waterTotal: '',
  waterPercentage: '',
  visceralFat: '',
  bmr: '',
  metabolicAge: '',
  boneMass: '',
  protein: '',
  abdominalCirc: '',
  waistHipRatio: '',
  skinfolds: '',
  notes: '',
  lArmFat: '', rArmFat: '',
  lLegFat: '', rLegFat: '',
  trunkFat: '',
  lArmMuscle: '', rArmMuscle: '',
  lLegMuscle: '', rLegMuscle: '',
  trunkMuscle: ''
};

function StudentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Estados para edição financeira
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [editFee, setEditFee] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Estado para Dieta
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [dietData, setDietData] = useState({ title: '', description: '' });

  // Estados para Bioimpedância Avançada
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [selectedBioId, setSelectedBioId] = useState<string | null>(null);
  const [bioData, setBioData] = useState(INITIAL_BIO_DATA);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studentRef = useMemoFirebase(() => id ? doc(db, 'users', id) : null, [db, id]);
  const measurementsQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'bodyMeasurements'), orderBy('createdAt', 'asc')) : null, [db, id]);
  const workoutHistoryQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'workoutHistory'), orderBy('completedAt', 'desc'), limit(50)) : null, [db, id]);
  const bioQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'bioimpedance'), orderBy('createdAt', 'desc')) : null, [db, id]);
  const dietsQuery = useMemoFirebase(() => id ? query(collection(db, 'users', id, 'dietSuggestions'), orderBy('createdAt', 'desc')) : null, [db, id]);

  const { data: student, isLoading } = useDoc(studentRef);
  const { data: measurements } = useCollection(measurementsQuery);
  const { data: history } = useCollection(workoutHistoryQuery);
  const { data: bioReports } = useCollection(bioQuery);
  const { data: diets } = useCollection(dietsQuery);

  useEffect(() => {
    if (student) {
      setEditFee(student.monthlyFee?.toString() || '0');
      setEditDueDate(student.paymentDueDate || '');
    }
  }, [student, isBillingModalOpen]);

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

  const handleSaveBilling = async () => {
    if (!studentRef) return;
    setIsUpdating(true);
    try {
      await updateDoc(studentRef, {
        monthlyFee: Number(editFee),
        paymentDueDate: editDueDate
      });
      toast({ title: "Dados Financeiros Atualizados!" });
      setIsBillingModalOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar dados financeiros" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenBioModal = (report?: any) => {
    if (report) {
      setSelectedBioId(report.id);
      setBioData({
        ...INITIAL_BIO_DATA,
        ...report
      });
    } else {
      setSelectedBioId(null);
      setBioData(INITIAL_BIO_DATA);
    }
    setIsBioModalOpen(true);
  };

  const handleSaveBio = async () => {
    if (!id) return;
    setIsUpdating(true);
    try {
      if (selectedBioId) {
        const bioRef = doc(db, 'users', id, 'bioimpedance', selectedBioId);
        await updateDoc(bioRef, {
          ...bioData,
          updatedAt: serverTimestamp()
        });
        toast({ title: "Avaliação Atualizada! 📊" });
      } else {
        await addDoc(collection(db, 'users', id, 'bioimpedance'), {
          ...bioData,
          createdAt: serverTimestamp(),
          trainerId: student?.trainerId
        });
        toast({ title: "Nova Avaliação de Bioimpedância Salva! 📊" });
      }
      setIsBioModalOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar bioimpedância" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDiet = async () => {
    if (!id) return;
    if (!dietData.title || !dietData.description) {
      toast({ variant: 'destructive', title: "Preencha todos os campos" });
      return;
    }
    setIsUpdating(true);
    try {
      await addDoc(collection(db, 'users', id, 'dietSuggestions'), {
        ...dietData,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Dieta Enviada! 🥗" });
      setIsDietModalOpen(false);
      setDietData({ title: '', description: '' });
    } catch (e) {
      toast({ variant: 'destructive', title: "Erro ao salvar dieta" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!studentRef || !student) return;
    setIsUpdating(true);
    try {
      const today = new Date();
      const currentDue = student.paymentDueDate ? new Date(student.paymentDueDate) : today;
      
      // Se o vencimento já passou, renovamos a partir de hoje. Se não, somamos 30 dias ao vencimento atual.
      const baseDate = currentDue < today ? today : currentDue;
      const nextDue = new Date(baseDate);
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
    if (!history) return { totalTime: 0, sessionsWeek: 0 };
    const totalTime = history.reduce((acc, h) => acc + (Number(h.duration) || 0), 0);
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const sessionsWeek = history.filter(h => {
      const date = h.completedAt?.toDate ? h.completedAt.toDate() : null;
      return date && date >= weekAgo;
    }).length;
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
    <div className="flex flex-col gap-8 w-full pb-20 max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <PageHeader title={student.fullName || 'Atleta'} subtitle="Gestão técnica, financeira e análise de performance avançada." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Lateral */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 shadow-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-4xl font-black text-primary mb-6 shadow-2xl overflow-hidden">
                {student.photoURL ? (
                  <img src={student.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  student.firstName?.[0]
                )}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{student.fullName}</h3>
              <div className="flex flex-col gap-1 mt-2 mb-6">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Mail className="h-3 w-3 text-primary" /> {student.email}
                </p>
                {student.phone && (
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Phone className="h-3 w-3 text-primary" /> {student.phone}
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
                    isExpired || student.status === 'blocked' ? "border-primary text-primary" : "border-green-500/30 text-green-500"
                  )}>
                    {student.status === 'blocked' ? 'BLOQUEADO' : isExpired ? 'INADIMPLENTE' : 'EM DIA'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 shadow-2xl p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Ações de Gestão</h4>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-16 rounded-2xl bg-primary font-black uppercase shadow-xl shadow-primary/20 hover:bg-primary/90">
                <Link href={`/trainer/workouts/builder?studentId=${id}`}>
                  <Dumbbell className="mr-2 h-5 w-5 stroke-[3px]" /> ATUALIZAR TREINO
                </Link>
              </Button>
              
              {student.status === 'blocked' || isExpired ? (
                <Button onClick={() => handleUpdateStatus('active')} disabled={isUpdating} variant="outline" className="w-full h-14 rounded-2xl border-green-500/30 text-green-500 font-black uppercase hover:bg-green-500/10">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck className="mr-2 h-5 w-5" />} LIBERAR ACESSO
                </Button>
              ) : (
                <Button onClick={() => handleUpdateStatus('blocked')} disabled={isUpdating} variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white/40 font-black uppercase hover:bg-primary/10 hover:text-primary transition-all">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldBan className="mr-2 h-5 w-5" />} BLOQUEAR ALUNO
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna Principal */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="bg-white/5 p-1.5 rounded-2xl h-16 w-full border border-white/5 gap-1 mb-8 overflow-x-auto overflow-y-hidden no-scrollbar">
              <TabsTrigger value="report" className="flex-1 min-w-[100px] font-black text-[9px] uppercase h-full rounded-xl data-[state=active]:bg-primary">
                <Activity className="mr-2 h-4 w-4" /> Relatório
              </TabsTrigger>
              <TabsTrigger value="bio" className="flex-1 min-w-[100px] font-black text-[9px] uppercase h-full rounded-xl data-[state=active]:bg-primary">
                <Scale className="mr-2 h-4 w-4" /> Bioimp.
              </TabsTrigger>
              <TabsTrigger value="diet" className="flex-1 min-w-[100px] font-black text-[9px] uppercase h-full rounded-xl data-[state=active]:bg-primary">
                <Utensils className="mr-2 h-4 w-4" /> Dieta
              </TabsTrigger>
              <TabsTrigger value="evolution" className="flex-1 min-w-[100px] font-black text-[9px] uppercase h-full rounded-xl data-[state=active]:bg-primary">
                <TrendingUp className="mr-2 h-4 w-4" /> Evolução
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex-1 min-w-[100px] font-black text-[9px] uppercase h-full rounded-xl data-[state=active]:bg-primary">
                <CreditCard className="mr-2 h-4 w-4" /> Finan.
              </TabsTrigger>
            </TabsList>

            {/* Aba de Dieta */}
            <TabsContent value="diet" className="space-y-6">
              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Plano Alimentar</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-white/20 uppercase mt-1">Envie orientações nutricionais para este aluno.</CardDescription>
                  </div>
                  <Dialog open={isDietModalOpen} onOpenChange={setIsDietModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl bg-primary font-black text-[10px] uppercase px-6">
                        <Plus className="h-4 w-4 mr-2" /> Nova Sugestão
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white rounded-[2.5rem] max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="uppercase font-black flex items-center gap-2">
                          <Apple className="h-6 w-6 text-primary" /> Prescrever Dieta Elite
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Título da Orientação</Label>
                          <Input 
                            placeholder="Ex: Fase 1 - Hipertrofia Limpa" 
                            value={dietData.title}
                            onChange={(e) => setDietData({...dietData, title: e.target.value})}
                            className="bg-white/5 border-none h-12 rounded-xl font-bold" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-white/40 tracking-widest">Descrição / Cardápio Detalhado</Label>
                          <Textarea 
                            placeholder="Descreva as refeições, horários e macros recomendados..." 
                            value={dietData.description}
                            onChange={(e) => setDietData({...dietData, description: e.target.value})}
                            className="bg-white/5 border-none rounded-2xl min-h-[300px] font-medium" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSaveDiet} disabled={isUpdating} className="w-full bg-primary h-14 rounded-2xl font-black uppercase shadow-xl">
                          {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : "LIBERAR DIETA PARA O ALUNO"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-0">
                  {diets && diets.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {diets.map(diet => (
                        <div key={diet.id} className="p-8 space-y-4 hover:bg-white/[0.01] transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-white uppercase text-lg">{diet.title}</h4>
                            <Badge className="bg-white/5 text-white/40 border-none font-bold text-[10px]">
                              {diet.createdAt?.toDate().toLocaleDateString('pt-BR')}
                            </Badge>
                          </div>
                          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-sm text-white/60 leading-relaxed italic whitespace-pre-wrap">
                            {diet.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-24 text-center opacity-20">
                      <Utensils className="h-16 w-16 mx-auto mb-4" />
                      <p className="font-black uppercase text-[10px] tracking-widest">Nenhuma dieta cadastrada para este atleta.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba de Bioimpedância Avançada */}
            <TabsContent value="bio" className="space-y-6">
              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Avaliações Clínicas</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-white/20 uppercase mt-1">Registre dados detalhados de composição e metabolismo.</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenBioModal()} className="rounded-xl bg-primary font-black text-[10px] uppercase px-6">
                    <Plus className="h-4 w-4 mr-2" /> Nova Avaliação
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
                    <DialogContent className="bg-card border-white/10 text-white rounded-[2.5rem] max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
                      <DialogHeader className="p-8 border-b border-white/5">
                        <DialogTitle className="uppercase font-black flex items-center gap-2">
                          <Scale className="h-6 w-6 text-primary" /> {selectedBioId ? 'Editar' : 'Registrar'} Bioimpedância de Elite
                        </DialogTitle>
                      </DialogHeader>
                      
                      <ScrollArea className="flex-1">
                        <div className="p-8 space-y-10">
                          {/* Seção 1: Básicos */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Data da Avaliação</Label>
                              <Input type="date" value={bioData.date} onChange={(e) => setBioData({...bioData, date: e.target.value})} className="bg-white/5 border-none h-12 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Peso Corporal (kg)</Label>
                              <Input type="number" value={bioData.weight} onChange={(e) => setBioData({...bioData, weight: e.target.value})} className="bg-white/5 border-none h-12 rounded-xl font-bold" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase font-black text-white/40 tracking-widest">IMC</Label>
                              <Input type="number" value={bioData.bmi} onChange={(e) => setBioData({...bioData, bmi: e.target.value})} className="bg-white/5 border-none h-12 rounded-xl font-bold" />
                            </div>
                          </div>

                          {/* Seção 2: Composição Massa e Gordura */}
                          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-6">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                              <Dna className="h-4 w-4" /> Composição Corporal
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Gordura Corporal (%)</Label>
                                <Input type="number" value={bioData.fatTotal} onChange={(e) => setBioData({...bioData, fatTotal: e.target.value})} className="bg-black/20 border-none h-10 rounded-lg text-xs" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Massa de Gordura (kg)</Label>
                                <Input type="number" value={bioData.fatMass} onChange={(e) => setBioData({...bioData, fatMass: e.target.value})} className="bg-black/20 border-none h-10 rounded-lg text-xs" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Massa Magra (kg)</Label>
                                <Input type="number" value={bioData.leanMass} onChange={(e) => setBioData({...bioData, leanMass: e.target.value})} className="bg-black/20 border-none h-10 rounded-lg text-xs" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Massa Muscular Total (kg)</Label>
                                <Input type="number" value={bioData.muscleTotal} onChange={(e) => setBioData({...bioData, muscleTotal: e.target.value})} className="bg-black/20 border-none h-10 rounded-lg text-xs" />
                              </div>
                            </div>
                          </div>

                          {/* Seção 3: Metabolismo e Água */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <Flame className="h-4 w-4" /> Metabolismo & Ósseo
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Taxa Metabólica Basal</Label>
                                  <Input type="number" value={bioData.bmr} onChange={(e) => setBioData({...bioData, bmr: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Idade Metabólica</Label>
                                  <Input type="number" value={bioData.metabolicAge} onChange={(e) => setBioData({...bioData, metabolicAge: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Gordura Visceral</Label>
                                  <Input type="number" value={bioData.visceralFat} onChange={(e) => setBioData({...bioData, visceralFat: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Massa Óssea (kg)</Label>
                                  <Input type="number" value={bioData.boneMass} onChange={(e) => setBioData({...bioData, boneMass: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <Droplets className="h-4 w-4" /> Hidratação & Proteína
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Água Corporal (L)</Label>
                                  <Input type="number" value={bioData.waterTotal} onChange={(e) => setBioData({...bioData, waterTotal: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Água (%)</Label>
                                  <Input type="number" value={bioData.waterPercentage} onChange={(e) => setBioData({...bioData, waterPercentage: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Proteína Corporal (kg)</Label>
                                  <Input type="number" value={bioData.protein} onChange={(e) => setBioData({...bioData, protein: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] uppercase font-bold text-white/20">Massa Muscular Esq. (kg)</Label>
                                  <Input type="number" value={bioData.skeletalMuscle} onChange={(e) => setBioData({...bioData, skeletalMuscle: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Seção 4: Antropometria */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                              <Layers className="h-4 w-4" /> Antropometria
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Circunferência Abdominal (cm)</Label>
                                <Input type="number" value={bioData.abdominalCirc} onChange={(e) => setBioData({...bioData, abdominalCirc: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Relação Cintura/Quadril</Label>
                                <Input type="number" step="0.01" value={bioData.waistHipRatio} onChange={(e) => setBioData({...bioData, waistHipRatio: e.target.value})} className="bg-white/5 border-none h-10 rounded-lg" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-bold text-white/20">Dobras Cutâneas (Opcional)</Label>
                                <Input type="text" value={bioData.skinfolds} onChange={(e) => setBioData({...bioData, skinfolds: e.target.value})} placeholder="Ex: Tricipital 12mm..." className="bg-white/5 border-none h-10 rounded-lg" />
                              </div>
                            </div>
                          </div>

                          {/* Seção 5: Segmentação */}
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                              <Activity className="h-4 w-4" /> Distribuição Segmentada
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase text-primary/60">Gordura Segmentada (%)</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">B. Esq</Label>
                                    <Input type="number" value={bioData.lArmFat} onChange={(e) => setBioData({...bioData, lArmFat: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">B. Dir</Label>
                                    <Input type="number" value={bioData.rArmFat} onChange={(e) => setBioData({...bioData, rArmFat: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">P. Esq</Label>
                                    <Input type="number" value={bioData.lLegFat} onChange={(e) => setBioData({...bioData, lLegFat: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">P. Dir</Label>
                                    <Input type="number" value={bioData.rLegFat} onChange={(e) => setBioData({...bioData, rLegFat: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">Tronco</Label>
                                    <Input type="number" value={bioData.trunkFat} onChange={(e) => setBioData({...bioData, trunkFat: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase text-green-500/60">Massa Muscular Segmentada (%)</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">B. Esq</Label>
                                    <Input type="number" value={bioData.lArmMuscle} onChange={(e) => setBioData({...bioData, lArmMuscle: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">B. Dir</Label>
                                    <Input type="number" value={bioData.rArmMuscle} onChange={(e) => setBioData({...bioData, rArmMuscle: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">P. Esq</Label>
                                    <Input type="number" value={bioData.lLegMuscle} onChange={(e) => setBioData({...bioData, lLegMuscle: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">P. Dir</Label>
                                    <Input type="number" value={bioData.rLegMuscle} onChange={(e) => setBioData({...bioData, rLegMuscle: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <Label className="text-[8px] uppercase text-white/40">Tronco</Label>
                                    <Input type="number" value={bioData.trunkMuscle} onChange={(e) => setBioData({...bioData, trunkMuscle: e.target.value})} className="bg-black/20 border-none h-9 text-xs" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase font-black text-white/40 tracking-widest">Observações da Avaliação</Label>
                            <Textarea value={bioData.notes} onChange={(e) => setBioData({...bioData, notes: e.target.value})} placeholder="Anote percepções subjetivas..." className="bg-white/5 border-none rounded-2xl min-h-[100px]" />
                          </div>
                        </div>
                      </ScrollArea>

                      <DialogFooter className="p-8 border-t border-white/5">
                        <Button onClick={handleSaveBio} disabled={isUpdating} className="w-full bg-primary h-16 rounded-[1.8rem] font-black uppercase text-lg shadow-xl shadow-primary/20">
                          {isUpdating ? <Loader2 className="animate-spin h-6 w-6" /> : selectedBioId ? "ATUALIZAR AVALIAÇÃO" : "FINALIZAR E SALVAR AVALIAÇÃO"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {bioReports && bioReports.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {bioReports.map(report => (
                        <div 
                          key={report.id} 
                          onClick={() => handleOpenBioModal(report)}
                          className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform">
                              <Scale className="h-7 w-7" />
                            </div>
                            <div>
                              <p className="font-black text-white uppercase text-lg tracking-tight">Avaliação Clínica</p>
                              <p className="text-[10px] text-white/40 font-bold uppercase mt-1">
                                Realizada em {new Date(report.date || report.createdAt?.toDate()).toLocaleDateString('pt-BR')} • {report.weight}kg
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="hidden md:flex gap-8">
                              <div className="text-right">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Gordura</p>
                                <p className="text-xl font-black text-primary">{report.fatTotal}%</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Músculo</p>
                                <p className="text-xl font-black text-green-500">{report.muscleTotal}kg</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-24 text-center opacity-20">
                      <Scale className="h-16 w-16 mx-auto mb-4" />
                      <p className="font-black uppercase text-[10px] tracking-widest">Nenhuma avaliação detalhada lançada.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-[2rem] bg-[#1a1d24] border border-white/5 p-8 flex items-center gap-5 shadow-xl">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tempo Total de Treino</p>
                    <p className="text-3xl font-black text-white">{reportStats.totalTime} <span className="text-xs font-bold text-primary">min</span></p>
                  </div>
                </Card>
                <Card className="rounded-[2rem] bg-[#1a1d24] border border-white/5 p-8 flex items-center gap-5 shadow-xl">
                  <div className="p-4 rounded-2xl bg-green-500/10 text-green-500">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Frequência Semanal</p>
                    <p className="text-3xl font-black text-white">{reportStats.sessionsWeek} <span className="text-xs font-bold text-green-500">sessões</span></p>
                  </div>
                </Card>
              </div>

              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                  <CardTitle className="text-sm font-black uppercase text-white tracking-widest">Últimas Atividades Registradas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {history && history.length > 0 ? (
                    history.map(log => (
                      <div key={log.id} className="p-8 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-primary shadow-inner">
                            <Zap className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase text-base tracking-tight">{log.planName || 'Treino'}</p>
                            <p className="text-[10px] font-bold text-white/20 uppercase mt-1">Concluído em {log.completedAt?.toDate().toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px] px-4 py-1.5 bg-primary/5 rounded-full">
                          {log.duration} MIN
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-24 text-center">
                      <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="h-8 w-8 text-white/10" />
                      </div>
                      <div className="text-white/20 uppercase font-black text-[10px] tracking-widest italic">Nenhum treino realizado ainda.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolution">
              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 pb-4">
                  <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3 tracking-tighter">
                    <Scale className="h-6 w-6 text-primary" /> Histórico de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[400px]">
                  {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" dy={10} />
                        <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#ffffff40" fontWeight="900" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1d24', borderRadius: '24px', border: '1px solid rgba(255,0,0,0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={5} 
                          dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 3, stroke: "#1a1d24" }} 
                          activeDot={{ r: 10, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-6">
                      <div className="p-10 rounded-full bg-white/5">
                        <TrendingUp className="h-16 w-16" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">
                        Sem registros de medidas suficientes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="rounded-[2.5rem] bg-[#1a1d24] border border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black uppercase text-white tracking-widest">Controle de Faturamento</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-white/20 uppercase mt-1">Ajuste valores mensais e valide recebimentos.</CardDescription>
                  </div>
                  <Dialog open={isBillingModalOpen} onOpenChange={setIsBillingModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-white hover:bg-primary uppercase font-black text-[10px]">
                        <Edit2 className="h-3 w-3 mr-2" /> Ajustar Dados
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white rounded-[2.5rem]">
                      <DialogHeader>
                        <DialogTitle className="uppercase font-black">Ajustar Faturamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black opacity-40">Valor da Mensalidade (R$)</Label>
                          <Input type="number" value={editFee} onChange={(e) => setEditFee(e.target.value)} className="bg-white/5 border-none h-12 rounded-xl font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="uppercase text-[10px] font-black opacity-40">Próximo Vencimento</Label>
                          <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="bg-white/5 border-none h-12 rounded-xl font-bold" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSaveBilling} disabled={isUpdating} className="w-full bg-primary h-14 rounded-2xl font-black uppercase">
                          {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : "Salvar Alterações"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest ml-1">Próximo Vencimento</Label>
                      <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center px-6 font-black text-white text-lg tracking-tight">
                        <Calendar className="h-5 w-5 text-primary mr-3" />
                        {student.paymentDueDate ? new Date(student.paymentDueDate).toLocaleDateString('pt-BR') : 'NÃO DEFINIDO'}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest ml-1">Valor da Mensalidade</Label>
                      <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center px-6 font-black text-white text-lg tracking-tight">
                        <DollarSign className="h-5 w-5 text-primary mr-3" />
                        R$ {Number(student.monthlyFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-colors",
                    isExpired || student.status === 'blocked' 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-green-500/10 border border-green-500/20"
                  )}>
                    <div className="flex items-center gap-5 text-center md:text-left">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0",
                        isExpired || student.status === 'blocked' ? "bg-primary text-white" : "bg-green-500 text-white"
                      )}>
                        {isExpired || student.status === 'blocked' ? <AlertTriangle className="h-7 w-7 stroke-[2.5px]" /> : <ShieldCheck className="h-7 w-7 stroke-[2.5px]" />}
                      </div>
                      <div>
                        <p className="font-black text-white uppercase text-lg tracking-tighter">Status da Assinatura</p>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest mt-1", isExpired || student.status === 'blocked' ? "text-primary" : "text-green-500")}>
                          {student.status === 'blocked' ? 'ACESSO SUSPENSO' : isExpired ? 'PAGAMENTO EM ATRASO' : 'MENSALIDADE EM DIA'}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleConfirmPayment} disabled={isUpdating} className="w-full md:w-auto h-14 px-8 font-black bg-white text-black hover:bg-white/90 shadow-xl rounded-xl text-xs tracking-tight uppercase transition-all active:scale-95" >
                      {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <><CreditCard className="mr-2 h-5 w-5" /> CONFIRMAR PAGAMENTO</>}
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
