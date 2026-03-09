"use client";

import { API_URL } from "@/lib/api";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useState, useEffect } from "react";

import IngredientTypeIcon from "@/app/components/IngredientTypeIcon";
import AddIngredientHeader from "@/app/components/AddIngredientHeader";

import IngredientStyles from '@/app/styles/pages/ingredients.module.css';
import EmptyView from "@/app/components/EmptyView";

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

export default function Ingredients() {
  const [loading, setLoading] = useState(true);

  const [ingredients, setIngredients] = useState<InventoryIngredient[]>([]);

  const [quantity, setQuantity] = useState<number | undefined>();
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>();

  const [ingredientTypes, setIngredientTypes] = useState<IngredientType[]>([]);
  const [selectedIngredientType, setSelectedIngredientType] = useState<number | undefined>();

  const auth = useContext(AuthContext);
  const loggedUserId = auth?.user?.id;

  const isQuantityFilled = quantity !== undefined;
  const isUnitFilled = selectedUnitId !== undefined;

  const isInvalidQuantity =
    (isQuantityFilled && !isUnitFilled) ||
    (!isQuantityFilled && isUnitFilled);
  

  const fetchIngredients = async () => {
    if (!loggedUserId) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/InventoryIngredient/user/${loggedUserId}`
      );
      if (!res.ok) return;

      const data: InventoryIngredient[] = await res.json();

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

  const fetchIngredientTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/IngredientTypes`);
      if (!res.ok) return;

      const data: IngredientType[] = await res.json();

      const sortedData = data.sort((a, b) => 
        a.name.localeCompare(b.name)
      );

      setIngredientTypes(sortedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loggedUserId) return;
    
    const loadIngredients = async () => {
      await fetchIngredients();
      await fetchIngredientTypes();
    };
    
    loadIngredients();
  }, [loggedUserId]);


  const filteredIngredients = selectedIngredientType
  ? ingredients.filter(
      (item) => item.ingredient.ingredientTypeId === selectedIngredientType
    )
  : ingredients;

  const groupedIngredients = ingredientTypes
    .map((type) => ({
      type,
      items: filteredIngredients.filter(
        (item) => item.ingredient.ingredientTypeId === type.id
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (!loggedUserId) {
    return <EmptyView title='Not logged in' text="Log in to add ingredients" btnText='Log In' btnUrl='/login' icon="profile" />
  }
  

  return (
    <main className={IngredientStyles.page}>

      <div className={IngredientStyles.header}>

        <h1 className={IngredientStyles.title}>Ingredient Inventory</h1>
        <AddIngredientHeader
          postUrl={`${API_URL}/api/InventoryIngredient`}
          onSuccess={fetchIngredients}
        />
        
      </div>

      <div className={IngredientStyles.main}>

        <div className={IngredientStyles.filters}>

          <select
            className={IngredientStyles.select}
            onChange={(e) =>
              setSelectedIngredientType(e.target.value === "" ? undefined : Number(e.target.value))}
          >
            <option value="">Select Type</option>
            {ingredientTypes.map((ingredientType) => (
              <option key={ingredientType.id} value={ingredientType.id}>
                {ingredientType.name.charAt(0).toUpperCase() + ingredientType.name.slice(1)}
              </option>
            ))}
          </select>

        </div>

        {loading ? (
          <p className={IngredientStyles.loader}>Loading Ingredients</p>
        ) : filteredIngredients.length === 0 ? (
          <EmptyView title='No ingredients yet' text='Add ingredients so you always know what’s in your kitchen.' icon="ingredient" />
        ) : (
          
          <div className={IngredientStyles.groupedList}>
            {groupedIngredients.map(({ type, items }) => (
              <div key={type.id} className={IngredientStyles.group}>
                <h2 className={IngredientStyles.groupTitle}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </h2>
                <ul className={IngredientStyles.list}>
                  {items.map((ingredient) => (
                    <li className={IngredientStyles.ingredient} key={ingredient.id}>

                      <div className={IngredientStyles.ingredientSign}>
                        <IngredientTypeIcon id={ingredient.ingredient.ingredientTypeId} />
                        <p className={IngredientStyles.ingredientName}>{ingredient.ingredient.name}</p>
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
            ))}
          </div>
        )}
      </div>

    </main>
  );
}