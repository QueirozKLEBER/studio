import { RedirectClient } from './RedirectClient';

export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page() {
  return <RedirectClient />;
}
