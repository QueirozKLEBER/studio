import { RedirectClient } from './RedirectClient';

/**
 * Requisito do Next.js 15 para output: export em rotas dinâmicas.
 * Gera um shell estático durante o build.
 */
export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page() {
  return <RedirectClient />;
}
