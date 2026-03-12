export async function generateStaticParams() {
  // Retorna um array vazio para satisfazer o requisito de exportação estática.
  return [];
}

export default function Page() {
  // Esta página é um shell estático para satisfazer o compilador do Next.js 15.
  // O app agora utiliza /workouts/plan?id=...
  return null;
}
