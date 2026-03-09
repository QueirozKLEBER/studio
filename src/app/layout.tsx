import type { Metadata } from "next";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "TreinusFit Personal",
  description: "Seu personal trainer mobile de elite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}