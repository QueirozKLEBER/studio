import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <div className={cn("relative overflow-hidden flex items-center justify-center", className)}>
    <img
      src="/logo.png"
      alt="TreinusFit Logo"
      className="object-contain w-full h-full"
      {...props}
    />
  </div>
);
