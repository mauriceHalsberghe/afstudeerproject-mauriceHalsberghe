"use client";


import AddRecipeStyles from "@/app/styles/pages/addrecipe.module.css";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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

type Ingredient = {
    id: number;
    quantity: number;
    unit: string;
    ingredientName: string;
    isInInventory?: boolean;
};

type Recipe = {
    id: number;
    title: string;
    imageUrl: string;
    time: number;
    diet?: Diet;
    cuisine?: Cuisine;
    user?: User;
    steps: Step[];
    ingredients: Ingredient[];
    likeCount: number;
    averageRating?: number;
};



export default function Edit() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    const auth = useContext(AuthContext);
    const loggedUserId = auth?.user?.id;

    const params = useParams();
    const recipeId = Number(params.id);

    const fetchRecipe = async () => {
        try {
            let url = `${API_URL}/api/recipes/${recipeId}`;
            if (loggedUserId) {
                url = `${API_URL}/api/recipes/${recipeId}?currentUserId=${loggedUserId}`
            }
            const res = await fetch(url);
            const recipeData: Recipe = await res.json();
            setRecipe(recipeData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [recipeId, loggedUserId]);

    if (loading || auth?.loading) {
        return <div>LOADING</div>
    }

    if (recipe?.user?.id !== loggedUserId) {
        return (
            <div>
                cant edit recipe
            </div>
        )
    }

    return (
        <main className={AddRecipeStyles.page}>
            <h1 className={AddRecipeStyles.title}>Edit recipe</h1>
            {recipe?.title}
        </main>
    );
}