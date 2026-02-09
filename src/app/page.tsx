import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons/logo';
import { placeHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = placeHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">
            MFIT Personal
          </span>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Link href="/signup">Comece Agora</Link>
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
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight drop-shadow-lg uppercase">
              Treine com a Elite
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md font-medium">
              Planos de treino ultra-personalizados, acompanhamento técnico de verdade e a melhor plataforma de gestão fitness do Brasil.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg h-16 px-10 rounded-2xl shadow-xl">
                <Link href="/signup">QUERO MEU TREINO</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 uppercase tracking-tight">
              A MAIS COMPLETA DO MERCADO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="p-4 bg-primary/10 rounded-2xl mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swords text-primary"><path d="m15.2 2.8-2.4 2.4"/><path d="m11.6 6.4-2.5 2.5"/><path d="m8.8 12.1 2.5-2.5"/><path d="m14.6 9.3 2.4-2.4"/><path d="M5.2 2.8 2.8 5.2"/><path d="m2.8 21.2 18.4-18.4"/><path d="m18.8 21.2 2.4-2.4"/><path d="m12.4 17.6-2.5 2.5"/><path d="m15.2 11.9 2.5-2.5"/><path d="m9.4 14.7 2.4-2.4"/></svg>
                </div>
                <h3 className="text-xl font-headline font-bold mb-3 uppercase">Treinos de Elite</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Centenas de exercícios com descrições técnicas detalhadas e suporte total para o seu professor.
                </p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="p-4 bg-primary/10 rounded-2xl mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
                <h3 className="text-xl font-headline font-bold mb-3 uppercase">Inteligência Artificial</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Tire dúvidas sobre execução e nutrição com nosso assistente inteligente 24 horas por dia.
                </p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm">
                <div className="p-4 bg-primary/10 rounded-2xl mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <h3 className="text-xl font-headline font-bold mb-3 uppercase">Foco em Evolução</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Acompanhamento real com avaliações físicas, cálculo de IMC e métricas de massa magra.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t text-center p-8">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} MFIT PERSONAL. O PODER DA TÉCNICA.
        </p>
      </footer>
    </div>
  );
}
