
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Settings, Ruler, Weight, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://picsum.photos/seed/fitness_user1/200' },
  { id: 'av2', url: 'https://picsum.photos/seed/fitness_user2/200' },
  { id: 'av3', url: 'https://picsum.photos/seed/fitness_user3/200' },
  { id: 'av4', url: 'https://picsum.photos/seed/fitness_user4/200' },
  { id: 'av5', url: 'https://picsum.photos/seed/fitness_user5/200' },
  { id: 'av6', url: 'https://picsum.photos/seed/fitness_user6/200' },
];

export default function ProfilePage() {
  const { user, profile, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        height: formData.height,
        weight: formData.weight,
      });

      // Update Auth DisplayName
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      toast({
        title: "Perfil Atualizado! 🚀",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seus dados agora.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!user || !profile) return;

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        photoURL: url,
      });

      // Update Auth Photo
      await updateProfile(user, {
        photoURL: url,
      });

      toast({
        title: "Foto Atualizada! ✨",
        description: "Seu novo avatar já está brilhando no app.",
      });
      setIsAvatarDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na foto",
        description: "Ocorreu um problema ao trocar sua foto.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto w-full">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie seus dados e acompanhe suas medidas de elite."
      />

      {/* Header com Avatar */}
      <Card className="rounded-[2.5rem] border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-primary/10 shadow-xl overflow-hidden">
                <AvatarImage src={profile?.photoURL || user?.photoURL || ''} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black rounded-[2.5rem]">
                  {profile?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-2xl shadow-lg border-2 border-white hover:scale-110 transition-transform"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Escolher Novo Avatar</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    {PRESET_AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleUpdateAvatar(avatar.url)}
                        className="relative aspect-square rounded-2xl overflow-hidden hover:ring-4 ring-primary transition-all group"
                      >
                        <img src={avatar.url} alt="Preset Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="text-white h-6 w-6" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label className="font-bold text-xs uppercase opacity-70">Ou use uma URL personalizada</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://..." 
                        className="rounded-xl h-12" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateAvatar((e.target as HTMLInputElement).value);
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center md:text-left flex-1 space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">
                  {profile?.userType === 'trainer' ? 'PROFESSOR MFIT' : profile?.userType === 'admin' ? 'ADMINISTRADOR' : 'ALUNO ELITE'}
                </Badge>
                <Badge variant="outline" className="border-muted-foreground/20 text-muted-foreground font-bold text-[10px]">
                  MEMBRO DESDE {profile?.dateJoined ? new Date(profile.dateJoined).getFullYear() : '2024'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulários de Edição */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-muted p-1 rounded-2xl h-12 gap-1 mb-6">
          <TabsTrigger value="account" className="rounded-xl font-bold px-6 flex items-center gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="fitness" className="rounded-xl font-bold px-6 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Medidas e Fitness
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleUpdateProfile}>
          <TabsContent value="account">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Informações Básicas</CardTitle>
                <CardDescription>Atualize seu nome de exibição no app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-bold text-xs uppercase opacity-70">Primeiro Nome</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      defaultValue={profile?.firstName} 
                      onChange={handleInputChange}
                      className="rounded-xl h-12 bg-muted/30 border-none shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold text-xs uppercase opacity-70">Sobrenome</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      defaultValue={profile?.lastName} 
                      onChange={handleInputChange}
                      className="rounded-xl h-12 bg-muted/30 border-none shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-2 opacity-60">
                  <Label htmlFor="email" className="font-bold text-xs uppercase opacity-70">E-mail (Não editável)</Label>
                  <Input id="email" value={profile?.email} disabled className="rounded-xl h-12 bg-muted" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Sua Biometria</CardTitle>
                <CardDescription>Dados essenciais para cálculos de IMC e evolução corporal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Ruler className="h-5 w-5" />
                      <Label htmlFor="height" className="font-bold text-xs uppercase">Altura (cm)</Label>
                    </div>
                    <Input 
                      id="height" 
                      name="height" 
                      type="number" 
                      placeholder="Ex: 175" 
                      defaultValue={profile?.height} 
                      onChange={handleInputChange}
                      className="rounded-2xl h-16 text-2xl font-black border-2 border-primary/10 focus:border-primary transition-colors text-center"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-secondary">
                      <Weight className="h-5 w-5" />
                      <Label htmlFor="weight" className="font-bold text-xs uppercase">Peso Atual (kg)</Label>
                    </div>
                    <Input 
                      id="weight" 
                      name="weight" 
                      type="number" 
                      placeholder="Ex: 82" 
                      defaultValue={profile?.weight} 
                      onChange={handleInputChange}
                      className="rounded-2xl h-16 text-2xl font-black border-2 border-secondary/10 focus:border-secondary transition-colors text-center"
                    />
                  </div>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed italic">
                    "Mantenha esses dados atualizados mensalmente para que seu professor possa ajustar o volume de treino e suas macros com precisão cirúrgica."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              className="rounded-2xl h-14 px-10 font-black text-lg bg-primary text-white shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  SALVAR ALTERAÇÕES
                  <Save className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
