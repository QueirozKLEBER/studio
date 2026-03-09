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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] border border-slate-200 bg-white/90 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Logo className="w-20 h-20" />
              <span className="text-2xl font-black font-headline text-slate-900 uppercase tracking-tighter mt-2">
                TreinusFit <span className="text-primary">Personal</span>
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">{title}</CardTitle>
          <CardDescription className="text-slate-500 font-medium">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footerText && footerLink && footerLinkText && (
          <CardFooter className="justify-center text-sm border-t border-slate-50 mt-4 pt-6">
            <p className="text-slate-500 font-medium">
              {footerText}{' '}
              <Link href={footerLink} className="font-bold text-primary hover:underline transition-colors">
                {footerLinkText}
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}