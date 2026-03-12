/**
 * Este arquivo é um Server Component obrigatório para satisfazer os requisitos de 'output: export' do Next.js 15.
 * Ele define os parâmetros estáticos e exporta uma página vazia, já que a navegação real 
 * é redirecionada para rotas baseadas em searchParams (?id=...).
 */

export async function generateStaticParams() {
  // Retorna uma lista vazia para satisfazer o requisito de exportação estática do Next.js
  return [];
}

export const dynamic = 'force-static';

export default function Page() {
  return null;
}
