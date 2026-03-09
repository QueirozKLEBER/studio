'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { GraduationCap, Mail, Calendar, MoreVertical, Edit2 } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-56 rounded-[2.5rem] animate-pulse bg-card border-white/5" />)
        ) : trainers?.map((trainer) => (
          <Card key={trainer.id} className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden hover:border-primary/20 transition-all flex flex-col group">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  {trainer.firstName?.[0] || 'P'}
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1">
                  PROFESSOR
                </Badge>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{trainer.firstName} {trainer.lastName}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    {trainer.email}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    Membro desde {isMounted && trainer.dateJoined ? new Date(trainer.dateJoined).toLocaleDateString('pt-BR') : '...'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl h-11 font-black text-[9px] uppercase tracking-[0.15em] border-white/10 bg-white/5 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl">
                  <Edit2 className="h-3 w-3 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline" className="rounded-xl h-11 w-11 border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!isLoading && (!trainers || trainers.length === 0)) && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <GraduationCap className="h-16 w-16 mx-auto mb-4" />
            <p className="font-black uppercase tracking-[0.2em] italic">Nenhum professor registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
