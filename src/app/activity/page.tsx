'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Zap, History, Clock, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACTIVITY_TYPES = [
  { id: 'cardio', name: 'Cardio (Esteira/Bike)', icon: Flame },
  { id: 'hiit', name: 'HIIT / Funcional', icon: Zap },
  { id: 'sport', name: 'Esporte (Futebol/Luta)', icon: History },
  { id: 'extra', name: 'Treino Extra', icon: Plus },
];

export default function ActivityLogPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    type: 'cardio',
    duration: '',
    intensity: 'media',
    notes: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.duration) {
      toast({ variant: 'destructive', title: 'Faltam dados', description: 'Informe a duração da atividade.' });
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'workoutHistory'), {
        type: 'manual',
        activityType: formData.type,
        duration: formData.duration,
        intensity: formData.intensity,
        notes: formData.notes,
        planName: ACTIVITY_TYPES.find(t => t.id === formData.type)?.name || 'Atividade Manual',
        completedAt: serverTimestamp(),
      });

      toast({
        title: "Atividade Registrada! 🔥",
        description: "Seu professor já pode ver seu esforço extra.",
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Erro ao salvar",
        description: "Não foi possível registrar sua atividade.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto w-full px-1">
      <PageHeader 
        title="Log de Atividades" 
        subtitle="Registrou um cardio extra ou praticou um esporte? Anote aqui para seu professor." 
      />

      <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5 mb-6">
          <CardTitle className="text-xl font-black uppercase tracking-tight text-white">O que você fez hoje?</CardTitle>
          <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Mantenha seu personal informado sobre sua rotina fora da musculação.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Tipo de Atividade</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger className="rounded-xl h-12 bg-white/5 border-none text-white font-bold">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
                    {ACTIVITY_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Duração (minutos)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input 
                    type="number" 
                    placeholder="Ex: 45" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="rounded-xl h-12 pl-10 border-none bg-white/5 text-white font-bold placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Intensidade do Esforço</Label>
                <Select value={formData.intensity} onValueChange={(v) => setFormData({...formData, intensity: v})}>
                  <SelectTrigger className="rounded-xl h-12 bg-white/5 border-none text-white font-bold">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
                    <SelectItem value="baixa">Baixa (Leve)</SelectItem>
                    <SelectItem value="media">Média (Moderada)</SelectItem>
                    <SelectItem value="alta">Alta (Intensa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Observações para o Professor</Label>
              <Textarea 
                placeholder="Ex: Corri na praia em jejum, me senti bem e com muita energia." 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="rounded-2xl bg-white/5 border-none min-h-[120px] text-white font-medium placeholder:text-white/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl font-black text-xl bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-tight"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : 'SALVAR NO HISTÓRICO'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
