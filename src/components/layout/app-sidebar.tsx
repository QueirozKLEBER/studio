'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from '../icons/logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  BookOpen,
  Bot,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { placeHolderImages } from '@/lib/placeholder-data';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

const menuItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/workouts', label: 'Treinos', icon: Dumbbell },
  { href: '/assessment', label: 'Avaliação Física', icon: Activity },
  { href: '/blog', label: 'Blog MFIT', icon: BookOpen },
  { href: '/ai', label: 'IA Professor', icon: Bot },
  { href: '/pricing', label: 'Planos', icon: CreditCard },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const avatarImage = placeHolderImages.find(p => p.id === 'avatar-placeholder');

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getAvatarFallback = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    return 'U';
  }

  return (
    <SidebarProvider open={true} defaultOpen={true}>
      <Sidebar className="border-r bg-card w-64">
        <SidebarHeader className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-headline font-bold tracking-tight">MFIT</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="rounded-xl transition-all h-11"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/profile'} className="rounded-xl h-14">
                <Link href="/profile" className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-primary/10">
                    <AvatarImage src={user?.photoURL || avatarImage?.imageUrl} />
                    <AvatarFallback className="rounded-xl bg-blue-50 text-primary font-bold">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold truncate">{user?.displayName || 'Usuário'}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Ver Perfil</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="rounded-xl h-11 text-destructive hover:text-destructive hover:bg-destructive/5 mt-2">
                <LogOut className="h-5 w-5" />
                <span className="font-bold">Sair do App</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};
