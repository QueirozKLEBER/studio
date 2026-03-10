'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/**
 * Rota mantida apenas para redirecionamento seguro durante migração de IDs dinâmicos para searchParams.
 * Em 'output: export', rotas dinâmicas sem generateStaticParams fixos podem quebrar o build.
 */
export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    if (params.id) {
      router.replace(`/trainer/student-details?id=${params.id}`);
    }
  }, [params.id, router]);

  return null;
}

export async function generateStaticParams() {
  // Retornamos uma lista vazia e deixamos o useEffect lidar com o redirecionamento no cliente.
  // Isso evita que o Next.js tente gerar caminhos para IDs dinâmicos do Firestore no build.
  return [];
}
