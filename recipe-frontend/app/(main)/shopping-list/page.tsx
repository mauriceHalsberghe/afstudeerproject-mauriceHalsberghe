"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";

import Checkbox from "@/app/components/Checkbox";
import AddIngredientHeader from "@/app/components/AddIngredientHeader";
import IngredientStyles from '@/app/styles/pages/ingredients.module.css';

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

    const fetchShoppingList = async () => {
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
        
        const loadData = async () => {
        await fetchShoppingList();
        };
        
        loadData();
    }, [loggedUserId]);

    if (!loggedUserId) {
        return (
            <div>
                Log in to see shopping list
            </div>
        )
    }

    return (
        <main className={IngredientStyles.page}>

            <div className={IngredientStyles.header}>

                <h1 className={IngredientStyles.title}>Shopping List</h1>
                <AddIngredientHeader
                    postUrl="http://localhost:5041/api/ListIngredients"
                    onSuccess={fetchShoppingList}
                />
                                
            </div>

            <div className={IngredientStyles.main}>

                <ul className={IngredientStyles.list}>
                    {ingredients.map((ingredient) => (
                        <li className={IngredientStyles.ingredient} key={ingredient.id}>
                            <div className={IngredientStyles.ingredientSign}>
                                <Checkbox initialChecked={ingredient.checked} listIngredientId={ingredient.id} userId={loggedUserId}/>
                                {ingredient.ingredient.name}
                            </div>
                            {ingredient.quantity != null && ingredient.quantityUnit && (
                                <p className={IngredientStyles.ingredientQuantity}>
                                    {ingredient.quantity} {ingredient.quantityUnit?.shortName ?? ""}
                                </p>
                            )}

                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}