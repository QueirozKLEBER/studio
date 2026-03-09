import { cn } from "@/lib/utils";

/**
 * Componente de Logo preparado para ler o arquivo 'logo.png' 
 * que você deve colocar dentro da pasta 'public/'.
 */
export const Logo = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <div className={cn("relative overflow-hidden flex items-center justify-center", className)}>
    <img
      src="/logo.png"
      alt="TreinusFit Personal Logo"
      className="object-contain w-full h-full"
      {...props}
    />
  </div>
);
