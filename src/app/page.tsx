import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons/logo';
import { placeHolderImages } from '@/lib/placeholder-data';

export default function LandingPage() {
  const heroImage = placeHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">
            TreinoPro
          </span>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="ml-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/signup">Cadastre-se</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white px-4">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover object-center"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight drop-shadow-lg">
              Transforme seu Corpo e sua Mente
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Planos de treino personalizados, dicas de nutrição e
              acompanhamento profissional. Tudo em um só lugar.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link href="/signup">Comece Agora</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              Por que escolher a TreinoPro?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swords text-primary"><path d="m15.2 2.8-2.4 2.4"/><path d="m11.6 6.4-2.5 2.5"/><path d="m8.8 12.1 2.5-2.5"/><path d="m14.6 9.3 2.4-2.4"/><path d="M5.2 2.8 2.8 5.2"/><path d="m2.8 21.2 18.4-18.4"/><path d="m18.8 21.2 2.4-2.4"/><path d="m12.4 17.6-2.5 2.5"/><path d="m15.2 11.9 2.5-2.5"/><path d="m9.4 14.7 2.4-2.4"/></svg>
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Treinos Personalizados</h3>
                <p className="text-muted-foreground">
                  Receba treinos feitos sob medida para seus objetivos e
                  necessidades, criados por especialistas.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-primary"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Vídeos Demonstrativos</h3>
                <p className="text-muted-foreground">
                  Aprenda a execução correta de cada exercício com nossa
                  extensa biblioteca de vídeos.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple text-primary"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Dicas de Nutrição</h3>
                <p className="text-muted-foreground">
                  Acelere seus resultados com dicas alimentares para
                  emagrecimento, hipertrofia e mais energia.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t text-center p-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} TreinoPro. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
