"use client";

import Checkbox from "@/app/components/Checkbox";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";

type ListIngredient = {
    id: number;
    checked: boolean;
    quantity?: number;
    quantityUnit?: QuantityUnit;
    ingredient: Ingredient;
};

type QuantityUnit = {
    id: number;
    name: string;
    shortName: string;
};

type Ingredient = {
    id: number;
    name: string;
    alwaysInStock: boolean;
    ingredientTypeId: number;
};

type IngredientType = {
    id: number;
    name: string;
}

export default function ShoppingList() {
    const [loading, setLoading] = useState(true);
    const [ingredients, setIngredients] = useState<ListIngredient[]>([]);

    const auth = useContext(AuthContext);
    const loggedUserId = auth?.user?.id;

    const fetchIngredients = async () => {
        if (!loggedUserId) return;

        setLoading(true);

        try {
        const res = await fetch(
            `http://localhost:5041/api/ListIngredients/user/${loggedUserId}`
        );
        if (!res.ok) return;

        const data: ListIngredient[] = await res.json();

        const sortedData = data.sort((a, b) =>
            a.ingredient.name.localeCompare(b.ingredient.name)
        );

        setIngredients(sortedData);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };


    useEffect(() => {
        if (!loggedUserId) return;
        
        const loadIngredients = async () => {
        await fetchIngredients();
        };
        
        loadIngredients();
    }, [loggedUserId]);

    if (!loggedUserId) {
        return (
            <div>
                Log in to see shopping list
            </div>
        )
    }

    return (
        <div>
            <h1>Shopping list</h1>
            {ingredients.map((ingredient) => (
                <div key={ingredient.id}>
                    <Checkbox initialChecked={ingredient.checked} listIngredientId={ingredient.id} userId={loggedUserId}/>
                    {ingredient.ingredient.name}
                    {ingredient.quantity}
                    {ingredient.quantityUnit?.shortName}
                </div>
            ))}
        </div>
    )
}