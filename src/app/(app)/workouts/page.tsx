import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { muscleGroups } from '@/lib/placeholder-data';
import * as MuscleIcons from '@/components/icons/muscle-groups';
import { PageHeader } from '@/components/page-header';
import { ArrowRight } from 'lucide-react';

type MuscleIconComponents = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
};

const iconComponents: MuscleIconComponents = MuscleIcons;


export default function WorkoutsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Treinos"
        subtitle="Selecione o grupo muscular que você quer treinar hoje."
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {muscleGroups.map((group) => {
          const IconComponent = iconComponents[group.icon];
          return (
            <Link key={group.id} href={`/workouts/${group.id}`} className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                  {IconComponent && (
                    <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  )}
                  <span className="font-headline font-semibold text-base">
                    {group.name}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Ver treinos <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
