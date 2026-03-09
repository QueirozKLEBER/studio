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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-[3rem] border-none bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Logo className="w-20 h-20" />
              <span className="text-2xl font-black font-headline text-primary uppercase tracking-tighter mt-2">
                TreinusFit <span className="text-white">Personal</span>
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{title}</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footerText && footerLink && footerLinkText && (
          <CardFooter className="justify-center text-sm">
            <p className="text-muted-foreground font-medium">
              {footerText}{' '}
              <Link href={footerLink} className="font-bold text-primary hover:text-white transition-colors">
                {footerLinkText}
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
