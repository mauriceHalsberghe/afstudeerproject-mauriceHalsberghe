"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Diet = {
    id: number;
    name: string;
};

type Cuisine = {
    id: number;
    name: string;
};

type User = {
    id: number;
    username: string;
    avatar: string;
};

type Step = {
    id: number;
    stepNumber: number;
    description: string;
}

type RecipeIngredient = {
    id: number;
    quantity: number;
    quantityUnit?: QuantityUnit;
    ingredient: Ingredient;
}

type QuantityUnit = {
    id: number;
    name: string;
    shortName: string;
}

type Ingredient = {
    id: number;
    name: string;
}


type Recipe = {
    id: number;
    title: string;
    imageUrl: string;
    time: number;
    diet?: Diet;
    cuisine?: Cuisine;
    user?: User;
    steps: Step[];
    recipeIngredients: RecipeIngredient[];
};

export default function RecipeDetail() {
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchRecipe = async () => {
        try {
            const res = await fetch(`http://localhost:5041/api/recipes/${id}`);
            const recipeData: Recipe = await res.json();
            setRecipe(recipeData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchRecipe();
    }, []);

    if (!recipe) {
        return <p>Recipe not found</p>
    }

    return (
        <div>
            <h1>Recipe Detail</h1>
            {recipe.title}
            {recipe.user?.username}
            <Image width={360} height={200} alt={recipe.title} src={`http://localhost:5041/uploads/recipe-images/${recipe.imageUrl}`}/>
            
            {recipe.recipeIngredients.map((recipeIngredient) => (
                <div key={recipeIngredient.id}>
                    <p>{recipeIngredient.quantity} {recipeIngredient.quantityUnit?.shortName}</p>
                    <p>{recipeIngredient.ingredient.name}</p>
                </div>
            ))}
            
            {recipe.steps.map((step) => (
                <div key={step.id}>
                    <p>{step.stepNumber}</p>
                    <p>{step.description}</p>
                </div>
            ))}
        </div>
    );
}
