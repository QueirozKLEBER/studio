'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
  return [];
}