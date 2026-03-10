
import { RedirectClient } from './RedirectClient';

/**
 * Server Component para suportar static export.
 * Redireciona para a página baseada em searchParams.
 */
export async function generateStaticParams() {
  return [];
}

export default function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
  return <RedirectClient params={params} />;
}
