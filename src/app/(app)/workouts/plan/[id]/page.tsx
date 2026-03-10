'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/**
 * Rota mantida para redirecionamento seguro.
 * Migramos a execução de treinos para /workouts/plan?id=... para compatibilidade com build estático.
 */
export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    if (params.id) {
      router.replace(`/workouts/plan?id=${params.id}`);
    }
  }, [params.id, router]);

  return null;
}

export async function generateStaticParams() {
  return [];
}
