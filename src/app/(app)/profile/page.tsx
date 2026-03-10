
'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Settings, Ruler, Weight, Save, Loader2, Image as ImageIcon, Upload, LogOut, Phone, CreditCard, ShieldCheck, FileText, Smartphone, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://picsum.photos/seed/fitness_user1/200' },
  { id: 'av2', url: 'https://picsum.photos/seed/fitness_user2/200' },
  { id: 'av3', url: 'https://picsum.photos/seed/fitness_user3/200' },
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
    bio: '',
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
        bio: profile.bio || '',
        height: profile.height || '',
        weight: profile.weight || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        fullName: formData.fullName || `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
      };

      if (profile.userType === 'trainer') {
        updateData.cref = formData.cref;
        updateData.pixKey = formData.pixKey;
        updateData.bio = formData.bio;
      } else {
        updateData.height = formData.height;
        updateData.weight = formData.weight;
      }

      await updateDoc(userRef, updateData);

      await updateProfile(user, {
        displayName: updateData.fullName,
      });

      toast({
        title: "Perfil Atualizado! 🚀",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seus dados.",
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
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      await updateProfile(user, { photoURL: url });
      toast({ title: "Foto Atualizada! ✨" });
      setIsAvatarDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na foto" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        toast({ 
          variant: 'destructive', 
          title: 'Arquivo muito grande', 
          description: 'Por favor, escolha uma imagem de até 2MB.' 
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleUpdateAvatar(base64String);
      };
      reader.readAsDataURL(file);
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
    <div className="flex flex-col gap-8 pb-32 max-w-4xl mx-auto w-full px-1">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie seus dados e credenciais de elite."
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
                  <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-2xl shadow-lg border-2 border-card hover:scale-110 transition-transform">
                    <Camera className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-md bg-card border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase">Alterar Foto de Perfil</DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-6 py-6">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest text-center">Opção 1: Upload Personalizado</p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase shadow-xl shadow-primary/20"
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="animate-spin" /> : <><Upload className="mr-2 h-5 w-5" /> Enviar do Aparelho</>}
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="relative flex items-center justify-center">
                      <Separator className="bg-white/5" />
                      <span className="absolute bg-card px-4 text-[9px] font-black text-white/20 uppercase">Ou use um preset</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {PRESET_AVATARS.map((avatar) => (
                        <button 
                          key={avatar.id} 
                          onClick={() => handleUpdateAvatar(avatar.url)} 
                          className="aspect-square rounded-2xl overflow-hidden hover:ring-4 ring-primary transition-all border-2 border-white/5"
                        >
                          <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover" />
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
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">
                {profile?.userType === 'trainer' ? 'PROFESSOR MFIT' : 'ALUNO ELITE'}
              </Badge>
              <p className="text-sm text-white/40 font-medium">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-card border border-white/5 p-1 rounded-2xl h-12 gap-1 mb-6">
          <TabsTrigger value="account" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4" /> Dados Gerais
          </TabsTrigger>
          {profile?.userType === 'trainer' ? (
            <TabsTrigger value="pro" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShieldCheck className="h-4 w-4" /> Perfil Profissional
            </TabsTrigger>
          ) : (
            <TabsTrigger value="fitness" className="rounded-xl font-black text-[10px] uppercase px-6 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Settings className="h-4 w-4" /> Medidas Corporais
            </TabsTrigger>
          )}
        </TabsList>

        <form onSubmit={handleUpdateProfile}>
          <TabsContent value="account" className="space-y-6">
            <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Nome Completo</Label>
                    <Input name="fullName" value={formData.fullName} onChange={handleInputChange} className="rounded-xl h-12 bg-white/5 border-none text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">WhatsApp / Celular</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ex: 11999999999" className="rounded-xl h-12 bg-white/5 border-none text-white font-bold pl-10" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pro" className="space-y-6">
            <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Número do CREF</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input name="cref" value={formData.cref} onChange={handleInputChange} placeholder="Ex: 000000-G/SP" className="rounded-xl h-12 bg-white/5 border-none text-white font-bold uppercase pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Chave PIX para Recebimento</Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input name="pixKey" value={formData.pixKey} onChange={handleInputChange} placeholder="E-mail, CPF ou Telefone" className="rounded-xl h-12 bg-white/5 border-none text-white font-bold pl-10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase text-white/40 tracking-widest">Bio Profissional / Metodologia</Label>
                  <Textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Descreva sua experiência..." className="rounded-2xl bg-white/5 border-none min-h-[120px] text-white font-medium" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-6">
            <Card className="rounded-[2.5rem] border border-white/5 bg-card overflow-hidden">
              <CardContent className="p-8 grid grid-cols-2 gap-8 text-center">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase text-white/40">Altura (cm)</Label>
                  <Input name="height" type="number" value={formData.height} onChange={handleInputChange} className="rounded-2xl h-16 text-2xl font-black bg-white/5 border-none text-center text-white" />
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase text-white/40">Peso (kg)</Label>
                  <Input name="weight" type="number" value={formData.weight} onChange={handleInputChange} className="rounded-2xl h-16 text-2xl font-black bg-white/5 border-none text-center text-white" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-8 flex flex-col gap-4">
            <Button type="submit" className="rounded-2xl h-16 w-full font-black text-lg bg-primary text-white shadow-xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-tight" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="mr-2 h-5 w-5" />} SALVAR ALTERAÇÕES
            </Button>
            <Button type="button" variant="outline" onClick={handleLogout} className="md:hidden rounded-2xl h-14 w-full font-black text-lg border-2 border-destructive/20 text-destructive hover:bg-destructive/5 uppercase tracking-tight">
              <LogOut className="mr-2 h-5 w-5" /> SAIR DA CONTA
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
