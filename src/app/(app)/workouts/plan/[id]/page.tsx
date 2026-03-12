/**
 * Este arquivo é um Server Component para satisfazer os requisitos de 'output: export' do Next.js.
 * Ele não utiliza 'use client' para evitar conflitos com generateStaticParams durante o build.
 */
export async function generateStaticParams() {
  return [];
}

export default function StubPage() {
  return null;
}
