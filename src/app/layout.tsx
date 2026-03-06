
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'TreinusFit Personal',
  description: 'Aplicativo de Treino Android',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn('antialiased font-sans select-none')}>
        {children}
      </body>
    </html>
  );
}
