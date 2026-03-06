import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TreinusFit Personal",
  description: "Seu personal trainer mobile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}