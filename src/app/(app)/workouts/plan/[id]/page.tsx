import { RedirectClient } from './RedirectClient';

/**
 * Requisito do Next.js 15 para output: export em rotas dinâmicas.
 * Redireciona para o fluxo baseado em searchParams.
 */
export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page() {
  return <RedirectClient />;
}
