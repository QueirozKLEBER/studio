
'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Settings, Ruler, Weight, Save, Loader2, Image as ImageIcon, Upload, LogOut, Phone, CreditCard, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

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
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    cref: '',
    pixKey: '',
    height: '',
    weight: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        cref: profile.cref || '',
        pixKey: profile.pixKey || '',
        height: profile.height || '',
        weight: profile.weight || '',
      });
    }
  }, [profile]);

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
      
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        phone: formData.phone,
      };

      if (profile.userType === 'trainer') {
        updateData.cref = formData.cref;
        updateData.pixKey = formData.pixKey;
      }

      if (profile.userType === 'student') {
        updateData.height = formData.height;
        updateData.weight = formData.weight;
      }

      await updateDoc(userRef, updateData);

      await updateProfile(user, {
        displayName: formData.fullName || `${formData.firstName} ${formData.lastName}`.trim(),
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao sair' });
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!user || !profile) return;

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        photoURL: url,
      });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new globalThis.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        handleUpdateAvatar(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-4xl mx-auto w-full px-1">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie seus dados profissionais e acompanhe sua conta de elite."
      />

      <Card className="rounded-[2.5rem] border border-white/10 shadow-xl bg-card overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-primary/20 shadow-2xl overflow-hidden">
                <AvatarImage src={profile?.photoURL || user?.photoURL || ''} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black rounded-[2.5rem]">
                  {profile?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-2xl shadow-lg border-2 border-card hover:scale-110 transition-transform flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-md bg-card border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">Escolher Novo Avatar</DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-6 py-4">
                    <div className="space-y-3">
                      <Label className="font-bold text-xs uppercase opacity-70 text-white/60">Carregar do Dispositivo</Label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full h-14 rounded-2xl border-2 flex items-center justify-center gap-3 border-dashed border-white/10 hover:bg-white/5 transition-all text-white"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5 text-primary" />}
                        <span className="font-bold">Selecionar Foto</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Separator className="flex-1 bg-white/5" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Ou escolha um preset</span>
                      <Separator className="flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {PRESET_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          disabled={isUpdating}
                          onClick={() => handleUpdateAvatar(avatar.url)}
                          className="relative aspect-square rounded-2xl overflow-hidden hover:ring-4 ring-primary transition-all group disabled:opacity-50"
                        >
                          <img src={avatar.url} alt="Preset Avatar" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="text-white h-6 w-6" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center md:text-left flex-1 space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                {profile?.fullName || `${profile?.firstName} ${profile?.lastName}`}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">
                  {profile?.userType === 'trainer' ? 'PROFESSOR MFIT' : profile?.userType === 'admin' ? 'ADMINISTRADOR' : 'ALUNO ELITE'}
                </Badge>
                {profile?.cref && (
                  <Badge variant="outline" className="border-primary/20 text-primary font-bold text-[10px]">
                    CREF: {profile.cref}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/40 font-medium">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-card border border-white/5 p-1 rounded-2xl h-12 gap-1 mb-6">
          <TabsTrigger value="account" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4" />
            Dados Pessoais
          </TabsTrigger>
          {profile?.userType === 'trainer' ? (
            <TabsTrigger value="pro" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShieldCheck className="h-4 w-4" />
              Profissional
            </TabsTrigger>
          ) : (
            <TabsTrigger value="fitness" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              Biometria
            </TabsTrigger>
          )}
        </TabsList>

        <form onSubmit={handleUpdateProfile}>
          <TabsContent value="account">
            <Card className="rounded-[2.5rem] border border-white/5 shadow-xl bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Informações Básicas</CardTitle>
                <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Mantenha seus dados de contato atualizados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Nome Completo</Label>
                    <Input 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleInputChange}
                      placeholder="Ex: João da Silva Santos"
                      className="rounded-xl h-12 bg-white/5 border-none text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest flex items-center gap-2">
                      <Phone className="h-3 w-3 text-primary" /> Celular / WhatsApp
                    </Label>
                    <Input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className="rounded-xl h-12 bg-white/5 border-none text-white font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">E-mail de Cadastro</Label>
                    <Input value={profile?.email} disabled className="rounded-xl h-12 bg-black/20 border-none text-white/40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pro">
            <Card className="rounded-[2.5rem] border border-white/5 shadow-xl bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Credenciais e Pagamentos</CardTitle>
                <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Essencial para que seus alunos efetuem pagamentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-primary" /> Registro CREF
                    </Label>
                    <Input 
                      name="cref" 
                      value={formData.cref} 
                      onChange={handleInputChange}
                      placeholder="Ex: 000000-G/SP"
                      className="rounded-xl h-12 bg-white/5 border-none text-white font-bold uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-primary" /> Chave PIX para Mensalidades
                    </Label>
                    <Input 
                      name="pixKey" 
                      value={formData.pixKey} 
                      onChange={handleInputChange}
                      placeholder="CPF, E-mail ou Celular"
                      className="rounded-xl h-12 bg-white/5 border-none text-white font-bold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness">
            <Card className="rounded-[2.5rem] border border-white/5 shadow-xl bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Sua Biometria</CardTitle>
                <CardDescription className="text-white/40 font-bold uppercase text-[10px]">Essencial para o cálculo de macros e evolução.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Ruler className="h-5 w-5" />
                      <Label className="font-black text-[10px] uppercase">Altura (cm)</Label>
                    </div>
                    <Input 
                      name="height" 
                      type="number" 
                      value={formData.height} 
                      onChange={handleInputChange}
                      className="rounded-2xl h-16 text-2xl font-black bg-white/5 border-2 border-primary/10 focus:border-primary text-center text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Weight className="h-5 w-5" />
                      <Label className="font-black text-[10px] uppercase">Peso Atual (kg)</Label>
                    </div>
                    <Input 
                      name="weight" 
                      type="number" 
                      value={formData.weight} 
                      onChange={handleInputChange}
                      className="rounded-2xl h-16 text-2xl font-black bg-white/5 border-2 border-primary/10 focus:border-primary text-center text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-8 flex flex-col gap-4">
            <Button 
              type="submit" 
              className="rounded-2xl h-14 w-full font-black text-lg bg-primary text-white shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-tight"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-6 w-6 animate-spin" /> : 'SALVAR ALTERAÇÕES'}
            </Button>

            <Button 
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="md:hidden rounded-2xl h-14 w-full font-black text-lg border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-all uppercase tracking-tight"
            >
              <LogOut className="mr-2 h-5 w-5" />
              SAIR DA CONTA
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
