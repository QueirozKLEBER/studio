
import { muscleGroups } from '@/lib/placeholder-data';
import { MuscleClient } from './MuscleClient';

export async function generateStaticParams() {
  return muscleGroups.map((group) => ({
    muscle: group.id,
  }));
}

export default function ExerciseListPage({ params }: { params: Promise<{ muscle: string }> }) {
  return <MuscleClient params={params} />;
}
