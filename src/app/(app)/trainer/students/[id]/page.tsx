/**
 * Este arquivo existe apenas para evitar erros de compilação durante o 'next export'.
 * O aplicativo utiliza a rota '/trainer/student-details?id=...' para gerenciar alunos.
 */
export async function generateStaticParams() {
  return [];
}

export default function StubPage() {
  return null;
}
