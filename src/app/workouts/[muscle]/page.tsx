import { MuscleClient } from './MuscleClient';

/**
 * Define as rotas estáticas para o build.
 */
export async function generateStaticParams() {
  return [
    { muscle: "peito" },
    { muscle: "costas" },
    { muscle: "ombros" },
    { muscle: "biceps" },
    { muscle: "triceps" },
    { muscle: "pernas" }
  ];
}

export default function Page(props: { params: Promise<{ muscle: string }> }) {
  return <MuscleClient params={props.params} />;
}
