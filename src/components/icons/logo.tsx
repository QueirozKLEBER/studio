import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Componente de Logo otimizado para TreinusFit Personal.
 * Utiliza o arquivo 'public/logo.png'. 
 * Se o logo não aparecer, verifique se o arquivo está na pasta 'public' com o nome exato.
 */
export const Logo = ({ className }: LogoProps) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/logo.png"
      alt="TreinusFit Personal Logo"
      className="w-full h-full object-contain pointer-events-none select-none"
      onError={(e) => {
        // Fallback caso a imagem não seja encontrada
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) {
          parent.innerHTML = '<div class="text-primary font-black text-6xl italic">TFP</div>';
        }
      }}
    />
  </div>
);