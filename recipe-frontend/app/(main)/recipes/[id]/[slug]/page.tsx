import { API_URL } from "@/lib/api";
import RecipeDetailClient from "@/app/components/RecipeDetailClient";

export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/api/recipes/slugs`);
  const recipes: { id: string; slug: string }[] = await res.json();

  return recipes.map(({ id, slug }) => ({
    id: String(id),
    slug,
  }));
}

export default function Page() {
  return <RecipeDetailClient />;
}