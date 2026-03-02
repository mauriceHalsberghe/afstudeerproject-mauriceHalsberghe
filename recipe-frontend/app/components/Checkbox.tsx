import { useState } from "react";

import CheckboxChecked from '@/public/checkbox_checked.svg';
import CheckboxUnchecked from '@/public/checkbox_unchecked.svg';

type Props = {
    initialChecked: boolean;
    listIngredientId: number;
    userId: number;
}

export default function Checkbox({ initialChecked, userId, listIngredientId }: Props) {
    const [checked, setChecked] = useState(initialChecked);
    const [loading, setLoading] = useState(false);

    const toggleCheck = async () => {
        if (!userId) {
            console.log("Log in to modify list");
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:5041/api/ListIngredients/toggle?userId=${userId}&listIngredientId=${listIngredientId}`,
                {
                    method: "PUT", // Match backend
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update ingredient");
            }

            // Option 1: Optimistic update
            setChecked(prev => !prev);

            // Option 2 (safer): Use server response
            // const updatedItem = await response.json();
            // setChecked(updatedItem.checked);

        } catch (error) {
            console.error("Error updating ingredient:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={toggleCheck} style={{ cursor: "pointer" }}>
            {checked ? <CheckboxChecked /> : <CheckboxUnchecked />}
        </div>
    );
}