'use client';

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
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { placeHolderImages } from '@/lib/placeholder-data';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col h-full bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Logo className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tight">MFIT</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all mb-2",
            pathname === '/profile' ? "bg-muted" : "hover:bg-muted"
          )}
        >
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-sm">Sair do App</span>
        </button>
      </div>
    </div>
  );
};