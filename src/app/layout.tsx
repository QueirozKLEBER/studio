import type { Metadata } from "next";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Toaster } from "@/components/ui/toaster";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";

export const metadata: Metadata = {
  title: "TreinusFit Personal",
  description: "Seu personal trainer mobile de elite",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <meta name="theme-color" content="#ff0000" />
        <link rel="apple-touch-icon" href="/assets/icons/android/launchericon-192x192.png" />
      </head>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        <FirebaseClientProvider>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
