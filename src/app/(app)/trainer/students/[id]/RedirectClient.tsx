
'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export function RedirectClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  useEffect(() => {
    if (id) {
      router.replace(`/trainer/student-details?id=${id}`);
    }
  }, [id, router]);

  return null;
}
