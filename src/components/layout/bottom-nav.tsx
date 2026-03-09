'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, Activity, User, Utensils, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/workouts', label: 'Treinos', icon: Dumbbell },
  { href: '/activity', label: 'Logs', icon: Clock },
  { href: '/diet', label: 'Dieta', icon: Utensils },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-card/90 backdrop-blur-xl border-t border-primary/10 h-20 md:hidden pb-safe">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1.5 transition-all active:scale-90",
                isActive ? "text-primary" : "text-white/40"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
