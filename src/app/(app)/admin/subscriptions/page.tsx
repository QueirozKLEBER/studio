'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { CreditCard, Calendar, User, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function AdminSubscriptionsPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useMemoFirebase(() => query(collection(db, 'users'), where('userType', '==', 'student')), [db]);
  const { data: students, isLoading } = useCollection(studentsQuery);

  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return students?.filter(s => {
      const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => {
      const dateA = a.paymentDueDate ? new Date(a.paymentDueDate).getTime() : Infinity;
      const dateB = b.paymentDueDate ? new Date(b.paymentDueDate).getTime() : Infinity;
      return dateA - dateB;
    });
  }, [students, searchTerm]);

  const isExpired = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Gestão de Assinaturas" 
        subtitle="Controle financeiro e status de pagamento dos alunos." 
      />

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <Input 
          placeholder="BUSCAR POR ALUNO..." 
          className="rounded-2xl h-14 pl-12 bg-card border-white/5 text-white font-black uppercase text-[10px] tracking-widest focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 bg-card animate-pulse rounded-[2rem] border border-white/5" />)
        ) : filtered?.map((student) => (
          <Card key={student.id} className="rounded-[2rem] border border-white/5 bg-card overflow-hidden hover:border-primary/20 transition-all group">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg",
                  isExpired(student.paymentDueDate) ? "bg-red-500 text-white" : "bg-primary text-white"
                )}>
                  {student.firstName?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white uppercase tracking-tight truncate">{student.firstName} {student.lastName}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{student.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-end">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Próximo Vencimento</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span className={cn(
                      "text-sm font-black tracking-tight",
                      isExpired(student.paymentDueDate) ? "text-red-500" : "text-white"
                    )}>
                      {student.paymentDueDate ? new Date(student.paymentDueDate).toLocaleDateString('pt-BR') : 'NÃO DEFINIDO'}
                    </span>
                  </div>
                </div>

                <Badge className={cn(
                  "font-black text-[9px] uppercase px-4 py-1.5 rounded-full border-none",
                  isExpired(student.paymentDueDate) ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                )}>
                  {isExpired(student.paymentDueDate) ? 'VENCIDO' : 'EM DIA'}
                </Badge>

                <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-primary hover:text-white transition-all">
                  <Link href={`/trainer/student-details?id=${student.id}`}>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered?.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
            <CreditCard className="h-16 w-16 mx-auto mb-4" />
            <p className="font-black uppercase tracking-[0.2em] italic">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}