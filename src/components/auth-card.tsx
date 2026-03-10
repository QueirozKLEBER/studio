
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
};

export function AuthCard({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <Card className="w-full max-w-md shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] border border-white/5 bg-card overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6 pt-4">
            <Link href="/" className="flex flex-col items-center gap-2 group">
              <Logo className="w-20 h-20 transition-transform group-hover:scale-110 duration-500" />
              <span className="text-2xl font-black font-headline text-white uppercase tracking-tighter mt-2">
                TreinusFit <span className="text-primary">Personal</span>
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{title}</CardTitle>
          <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 px-8">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {children}
        </CardContent>
        {footerText && footerLink && footerLinkText && (
          <CardFooter className="justify-center text-sm border-t border-white/5 mt-4 py-8 bg-black/20">
            <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.3em]">
              {footerText}{' '}
              <Link href={footerLink} className="font-black text-primary hover:text-primary/80 transition-colors ml-1">
                {footerLinkText}
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
