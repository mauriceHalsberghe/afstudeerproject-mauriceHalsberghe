import Image from 'next/image';

import RecipeCardStyles from '@/app/styles/components/recipecard.module.css';

type Recipe = {
  id: number;
  title: string;
  instructions: string;
  imageUrl: string;
  time: number;
};

type Props = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: Props) {
  return (
    <div className={RecipeCardStyles.card}>
      <Image
        className={RecipeCardStyles.image}
        width={200}
        height={100}
        src={`http://localhost:5041/uploads/${recipe.imageUrl}`}
        alt={recipe.title}
      />
      <div className={RecipeCardStyles.text}>
        <h2 className={RecipeCardStyles.title}>{recipe.title}</h2>
        <p className={RecipeCardStyles.time}>{recipe.time} min</p>
      </div>
    </div>
  );
}

export default RecipeCard;