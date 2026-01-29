import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-8 h-8", className)}
      {...props}
    >
      <title>TreinoPro Logo</title>
      <path d="M21 8H3" />
      <path d="M12 2v13" />
      <path d="M18 20a2 2 0 0 0-4 0" />
      <path d="M10 20a2 2 0 0 0-4 0" />
      <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
  