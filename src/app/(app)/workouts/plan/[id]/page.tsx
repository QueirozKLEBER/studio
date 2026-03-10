/**
 * Este arquivo existe apenas para evitar erros de compilação durante o 'next export'.
 * O aplicativo utiliza a rota '/workouts/plan?id=...' para execução de treinos.
 */
export async function generateStaticParams() {
  return [];
}

export default function StubPage() {
  return null;
}
