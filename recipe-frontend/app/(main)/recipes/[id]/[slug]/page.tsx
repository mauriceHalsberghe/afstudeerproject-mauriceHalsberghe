import { RecipeDetails } from "@/types/RecipeTypes";
import RecipeDetailClient from "@/app/components/RecipeDetailClient";

const API_URL = process.env.API_URL;

type Props = {
  params: Promise<{ id: string; slug?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/recipes/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return {};

    const recipe: RecipeDetails = await res.json();

    return {
      title: recipe.title,
      openGraph: {
        title: recipe.title,
        images: [
          {
            url: `${API_URL}/uploads/recipe-images/${recipe.imageUrl}`,
            width: 1200,
            height: 630,
            alt: recipe.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: recipe.title,
        images: [`${API_URL}/uploads/recipe-images/${recipe.imageUrl}`],
      },
    };
  } catch {
    return {};
  }
}

export default function RecipeDetailPage() {
  return <RecipeDetailClient />;
}