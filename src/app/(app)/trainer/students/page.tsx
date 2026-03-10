'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Search, Filter, ChevronRight, UserPlus, Mail, Calendar, Phone, CreditCard, AlertTriangle, ShieldBan } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function TrainerStudentsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const studentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Removendo orderBy temporariamente para evitar erro de índice ausente no primeiro load
    return query(
      collection(db, 'users'), 
      where('trainerId', '==', user.uid)
    );
  }, [db, user]);

  const { data: students, isLoading } = useCollection(studentsQuery);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return students.filter(s => {
      const name = (s.fullName || s.firstName || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
      
      const isLate = s.paymentDueDate && new Date(s.paymentDueDate) < today;
      
      if (statusFilter === 'all') return matchesSearch;
      if (statusFilter === 'active') return matchesSearch && s.status === 'active' && !isLate;
      if (statusFilter === 'late') return matchesSearch && isLate;
      if (statusFilter === 'blocked') return matchesSearch && s.status === 'blocked';
      
      return matchesSearch;
    }).sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  }, [students, searchTerm, statusFilter]);

  const getStatusBadge = (student: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isLate = student.paymentDueDate && new Date(student.paymentDueDate) < today;

    if (student.status === 'blocked') {
      return <Badge className="bg-black/40 text-white/40 border-none font-black text-[8px] uppercase px-3 py-1">BLOQUEADO</Badge>;
    }
    if (isLate) {
      return <Badge className="bg-primary/10 text-primary border-none font-black text-[8px] uppercase px-3 py-1 flex items-center gap-1">
        <AlertTriangle className="h-2 w-2" /> INADIMPLENTE
      </Badge>;
    }
    
    return <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[8px] uppercase px-3 py-1">ATIVO</Badge>;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Gestão de Atletas" 
          subtitle="Lista completa de alunos vinculados à sua consultoria." 
        />
        <Button variant="outline" className="rounded-2xl h-14 px-8 font-black border-white/10 text-white uppercase tracking-widest hover:bg-white/5 transition-all">
          <UserPlus className="mr-2 h-5 w-5 text-primary" /> CADASTRAR ALUNO
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
          <Input 
            placeholder="BUSCAR POR NOME OU E-MAIL..." 
            className="rounded-2xl h-14 pl-12 bg-card border-white/5 text-white font-black uppercase text-[10px] tracking-widest focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-64 rounded-2xl h-14 bg-card border-white/5 text-white font-black uppercase text-[10px] tracking-widest">
            <Filter className="mr-2 h-4 w-4 text-primary" />
            <SelectValue placeholder="FILTRAR STATUS" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl bg-card border-white/10 text-white">
            <SelectItem value="all">TODOS OS STATUS</SelectItem>
            <SelectItem value="active">ATIVOS</SelectItem>
            <SelectItem value="late">INADIMPLENTES</SelectItem>
            <SelectItem value="blocked">BLOQUEADOS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="h-64 rounded-[2.5rem] animate-pulse bg-white/5 border-none" />)
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Link key={student.id} href={`/trainer/student-details?id=${student.id}`}>
              <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl hover:border-primary/30 transition-all flex flex-col group h-full">
                <CardContent className="p-8 flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                      {(student.fullName || student.firstName || 'A')[0]}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(student)}
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Início {student.dateJoined ? new Date(student.dateJoined).toLocaleDateString('pt-BR') : '--'}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight line-clamp-1">{student.fullName || student.firstName}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
                        <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <CreditCard className="h-3.5 w-3.5 text-primary shrink-0" />
                        R$ {Number(student.monthlyFee || 0).toFixed(2)} / mês
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Próximo Vencimento</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span className={cn(
                          "text-xs font-black",
                          student.paymentDueDate && new Date(student.paymentDueDate) < new Date() ? "text-primary" : "text-white"
                        )}>
                          {student.paymentDueDate ? new Date(student.paymentDueDate).toLocaleDateString('pt-BR') : '--'}
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-white/20 group-hover:text-primary group-hover:bg-primary/10">
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center gap-4">
            <Search className="h-16 w-16" />
            <p className="font-black uppercase tracking-[0.3em]">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}