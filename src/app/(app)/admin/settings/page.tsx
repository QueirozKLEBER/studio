'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Database, Bell, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Configurações do Sistema" 
        subtitle="Controle parâmetros globais e segurança do MFIT Personal." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Segurança Geral
            </CardTitle>
            <CardDescription>Gerencie acessos e permissões críticas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Novos Cadastros</Label>
                <p className="text-sm text-muted-foreground">Permitir que novos alunos se registrem.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">Bloqueia o acesso ao app para todos.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-secondary" />
              Banco de Dados
            </CardTitle>
            <CardDescription>Limpeza e integridade dos dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2">
              Exportar Base de Usuários (CSV)
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2 text-destructive hover:bg-destructive/5">
              Limpar Cache de Treinos Antigos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
