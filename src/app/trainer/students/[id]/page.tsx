/**
 * Server Component estático para compatibilidade com build do Next.js.
 */
export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page() {
  return null;
}
