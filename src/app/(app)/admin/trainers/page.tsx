'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { GraduationCap, Mail, Calendar, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminTrainersPage() {
  const db = useFirestore();
  const trainersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'trainer')), [db]);
  const { data: trainers, isLoading } = useCollection(trainersQuery);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Gestão de Professores" 
        subtitle="Administre a equipe técnica de elite da plataforma." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-64 rounded-[2.5rem] animate-pulse bg-card border-white/5" />)
        ) : trainers?.map((trainer) => (
          <Card key={trainer.id} className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden hover:border-primary/20 transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
                  {trainer.firstName?.[0] || 'P'}
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase text-[9px] tracking-widest px-3 py-1">PROFESSOR</Badge>
              </div>
              
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{trainer.firstName} {trainer.lastName}</h3>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <Mail className="h-4 w-4 text-primary" />
                  {trainer.email}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <Calendar className="h-4 w-4 text-primary" />
                  Desde {isMounted && trainer.dateJoined ? new Date(trainer.dateJoined).toLocaleDateString('pt-BR') : '...'}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 text-white">Editar Perfil</Button>
                <Button variant="outline" className="rounded-2xl h-12 w-12 border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
