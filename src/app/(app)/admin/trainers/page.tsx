
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { GraduationCap, Mail, Calendar, ShieldCheck, MoreVertical } from 'lucide-react';
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
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Gestão de Professores" 
        subtitle="Administre a equipe técnica do MFIT Personal." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-48 rounded-[2rem] animate-pulse bg-muted" />)
        ) : trainers?.map((trainer) => (
          <Card key={trainer.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-black">
                  {trainer.firstName?.[0] || 'P'}
                </div>
                <Badge className="bg-purple-100 text-purple-600 border-none font-bold uppercase text-[10px]">PROFESSOR</Badge>
              </div>
              
              <h3 className="text-xl font-bold">{trainer.firstName} {trainer.lastName}</h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {trainer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Desde {isMounted ? new Date(trainer.dateJoined).toLocaleDateString() : '...'}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl font-bold border-2">Editar</Button>
                <Button variant="outline" className="rounded-xl border-2 px-3">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
