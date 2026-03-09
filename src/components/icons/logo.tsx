import Image from 'next/image';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Componente de Logo otimizado para Next.js.
 * Certifique-se de que o arquivo 'public/logo.png' existe.
 */
export const Logo = ({ className }: LogoProps) => (
  <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
    <Image
      src="/logo.png"
      alt="TreinusFit Personal Logo"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-contain"
      priority
    />
  </div>
);
