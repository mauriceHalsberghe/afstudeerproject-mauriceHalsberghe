"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useState, useEffect } from "react";

type InventoryIngredient = {
    id: number;
    quantity?: number;
    quantityUnit?: QuantityUnit;
    ingredient: Ingredient;
};

type QuantityUnit = {
    id: number;
    name: string;
    shortName: string;
}

type Ingredient = {
    id: number;
    name: string;
}


export default function Ingredients() {
    const [ingredients, setIngredients] = useState<InventoryIngredient[]>([]);
    const [loading, setLoading] = useState(true);

    const auth = useContext(AuthContext);
    const loggedUserId = auth?.user?.id;

    useEffect(() => {
        if (auth?.loading) return;
    
        if (!loggedUserId) {
          setLoading(false);
          return;
        }
    
        const fetchIngredients = async () => {
          setLoading(true);
          try {
            const res = await fetch(
              `http://localhost:5041/api/InventoryIngredient/user/${loggedUserId}`
            );
            const data: InventoryIngredient[] = await res.json();
    
            setIngredients(data);
          } catch (err) {
            console.error("Failed to fetch ingredients:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchIngredients();
    }, [loggedUserId, auth?.loading]);

    return (
        <>
        <h1>Ingredients</h1>
            <form>
                <h2>Add ingredient</h2>
                
            </form>
            <ul>
                {
                    ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            <p>{ingredient.ingredient.name}</p>
                            {ingredient.quantity && <p>{ingredient.quantity} {ingredient.quantityUnit?.shortName}</p>}
                            
                        </li>
                    ))
                }
            </ul>
            
        </>
    )
}