'use client';

import { Logo } from '../icons/logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  CreditCard,
  LogOut,
  Users,
  ShieldCheck,
  Settings,
  Utensils,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, profile } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getMenuItems = () => {
    if (!profile) return [];
    
    if (profile.userType === 'admin') {
      return [
        { href: '/admin/dashboard', label: 'Painel ADM', icon: ShieldCheck },
        { href: '/admin/trainers', label: 'Professores', icon: Users },
        { href: '/admin/students', label: 'Alunos', icon: Users },
        { href: '/admin/settings', label: 'Configurações', icon: Settings },
      ];
    }
    
    if (profile.userType === 'trainer') {
      return [
        { href: '/trainer/dashboard', label: 'Dashboard Prof', icon: LayoutDashboard },
        { href: '/trainer/students', label: 'Meus Alunos', icon: Users },
        { href: '/trainer/workouts/builder', label: 'Montar Treino', icon: Dumbbell },
      ];
    }

    return [
      { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
      { href: '/workouts', label: 'Meus Treinos', icon: Dumbbell },
      { href: '/activity', label: 'Atividades', icon: Clock },
      { href: '/diet', label: 'Minha Dieta', icon: Utensils },
      { href: '/assessment', label: 'Avaliação Física', icon: Activity },
      { href: '/pricing', label: 'Planos', icon: CreditCard },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/5">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-transparent p-1">
            <Logo className="w-10 h-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black font-headline text-white leading-tight uppercase tracking-tighter">TreinusFit</span>
            <span className="text-xs font-bold text-primary leading-tight uppercase tracking-widest">Personal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground")} />
              <span className="font-black text-xs uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 p-3 rounded-2xl transition-all mb-2 border border-transparent",
            pathname === '/profile' ? "bg-white/5 border-white/10" : "hover:bg-white/5"
          )}
        >
          <Avatar className="h-10 w-10 rounded-xl border-2 border-primary/20 overflow-hidden shadow-lg">
            <AvatarImage 
              src={profile?.photoURL || user?.photoURL || ''} 
              className="object-cover"
            />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black uppercase text-sm">
              {profile?.firstName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-white truncate uppercase tracking-tight">
              {profile?.firstName || 'Atleta'}
            </span>
            <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">
              {profile?.userType === 'trainer' ? 'Professor' : profile?.userType === 'admin' ? 'Admin' : 'Aluno Elite'}
            </span>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-black text-xs uppercase tracking-widest">Sair do App</span>
        </button>
      </div>
    </div>
  );
};
