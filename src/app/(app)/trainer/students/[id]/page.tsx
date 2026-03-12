export async function generateStaticParams() {
  // Retorna um array vazio para satisfazer o requisito de exportação estática
  // sem gerar páginas reais para esta rota legada.
  return [];
}

export default function Page() {
  // Esta página é um shell estático para satisfazer o compilador do Next.js 15.
  // O app agora utiliza /trainer/student-details?id=...
  return null;
}
