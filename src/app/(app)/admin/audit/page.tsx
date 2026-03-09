'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Activity, UserPlus, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminAuditPage() {
  const db = useFirestore();

  // Auditoria baseada em novos usuários (já que não temos um log global dedicado ainda)
  const auditQuery = useMemoFirebase(() => query(collection(db, 'users'), orderBy('dateJoined', 'desc'), limit(20)), [db]);
  const { data: actions, isLoading } = useCollection(auditQuery);

  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Auditória de Sistema" 
        subtitle="Acompanhe as últimas ações e registros na plataforma." 
      />

      <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Data/Hora</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Ação</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Usuário Afetado</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-white/40 tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6 h-16 bg-white/[0.02]" />
                    </tr>
                  ))
                ) : actions?.map((action) => (
                  <tr key={action.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-white/60 font-bold text-xs">
                        <Clock className="h-3 w-3 text-primary" />
                        {action.dateJoined ? new Date(action.dateJoined).toLocaleString('pt-BR') : '...'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <UserPlus className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-tight">Novo Cadastro</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-xs font-bold text-white">{action.firstName} {action.lastName}</p>
                        <p className="text-[10px] text-white/40 uppercase">{action.userType === 'trainer' ? 'Professor' : 'Aluno'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", action.status === 'blocked' ? "bg-red-500" : "bg-green-500")} />
                        <span className="text-[10px] font-black text-white/60 uppercase">{action.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
