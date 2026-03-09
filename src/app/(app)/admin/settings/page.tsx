'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Database, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-none pb-20">
      <PageHeader 
        title="Configurações do Sistema" 
        subtitle="Controle parâmetros globais e segurança da plataforma de elite." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="bg-white/5 pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Segurança Geral
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-tight">Gerencie acessos e permissões críticas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-white tracking-widest">Novos Cadastros</Label>
                <p className="text-[10px] font-bold text-white/40 uppercase">Permitir que novos alunos se registrem.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-white tracking-widest">Modo de Manutenção</Label>
                <p className="text-[10px] font-bold text-white/40 uppercase">Bloqueia o acesso ao app para todos.</p>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border border-white/5 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="bg-white/5 pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              Banco de Dados
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-white/40 tracking-tight">Limpeza e integridade dos dados de treino.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-8">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-xl">
              Exportar Base de Usuários (CSV)
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-xl">
              Limpar Cache de Treinos Antigos
            </Button>
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
              <p className="text-[9px] font-black text-primary uppercase text-center tracking-widest leading-relaxed">
                Aviso: A limpeza de cache é irreversível e afeta todos os usuários ativos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
