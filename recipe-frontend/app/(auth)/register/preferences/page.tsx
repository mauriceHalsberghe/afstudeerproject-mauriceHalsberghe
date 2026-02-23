"use client";

import { AuthContext } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from 'react';

import PrefStyles from '@/app/styles/pages/preferences.module.css';
import ButtonStyles from '@/app/styles/components/button.module.css';

type Diet = {
  id: number;
  name: string;
};

enum AllergyType {
    ingredient,
    ingredientType
}

type Allergy = {
  id: number;
  typeId: number;
  name: string;
  type: AllergyType
};

export default function RegisterPreferences() {
    const [step, setStep] = useState(1);

    const [diets, setDiets] = useState<Diet[]>([]);
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDiet, setSelectedDiet] = useState<number | null>(null);
    const [selectedAllergies, setSelectedAllergies] = useState<number[]>([]);

    const auth = useContext(AuthContext);
    const router = useRouter();

    
    useEffect(() => {
        setAllergies([
            { id: 1, typeId: 0, name: 'Gluten', type: AllergyType.ingredient },
            { id: 2, typeId: 3, name: 'Dairy', type: AllergyType.ingredientType },
            { id: 3, typeId: 0, name: 'Peanuts', type: AllergyType.ingredient },
            { id: 4, typeId: 1, name: 'Fish', type: AllergyType.ingredientType },
            { id: 5, typeId: 0, name: 'Soy', type: AllergyType.ingredient },
            { id: 6, typeId: 1, name: 'Eggs', type: AllergyType.ingredient },
            { id: 7, typeId: 1, name: 'Sesame', type: AllergyType.ingredient },
        ]);

        const fetchDiets = async () => {
            try {
            const res = await fetch('http://localhost:5041/api/diets');
            const data: Diet[] = await res.json();
            setDiets(data);
            } catch (err) {
            console.error(err);
            } finally {
            setLoading(false);
            }
        };
      fetchDiets();
    }, []);

    if (!diets) {
        return <p>Loading...</p>;
    }

    const toggleAllergy = (id: number) => {
        setSelectedAllergies(prev =>
        prev.includes(id)
            ? prev.filter(a => a !== id)
            : [...prev, id]
        );
    };

    if (!auth?.token) {
        console.error("User not authenticated");
        return;
    }

    const handleComplete = async () => {
        if (!auth?.token) {
            console.error("User not authenticated");
            return;
        }

        const ingredientAllergyIds = allergies
            .filter(
                a =>
                    selectedAllergies.includes(a.id) &&
                    a.type === AllergyType.ingredient
            )
            .map(a => a.id);

        const ingredientTypeAllergyIds = allergies
            .filter(
                a =>
                    selectedAllergies.includes(a.id) &&
                    a.type === AllergyType.ingredientType
            )
            .map(a => a.id);

        try {
            await fetch("http://localhost:5041/api/users/preferences", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    dietId: selectedDiet,
                    ingredientAllergyIds,
                    ingredientTypeAllergyIds
                })
            });

            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className={PrefStyles.page}>
            {auth.user && <h1 className={PrefStyles.title}>Welcome, {auth.user.username}!</h1>}

            {step === 1 && (
                <div className={PrefStyles.pageStep}>
                    <h2 className={PrefStyles.subtitle}>Step 1: Select your diet</h2>

                    <div className={PrefStyles.list}>
                        {diets.map((diet) => (
                            <div key={diet.id} className={PrefStyles.radio}>
                                <input id={diet.name} value={diet.id} className={PrefStyles.radioInput} type="radio" checked={selectedDiet === diet.id} onChange={(e) => setSelectedDiet(Number(e.target.value))}/>
                                <label htmlFor={diet.name} className={PrefStyles.radioLabel}>{diet.name}</label>
                            </div>
                        ))}
                    </div>


                    <button className={ButtonStyles.button} onClick={() => setStep(2)}>
                    Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className={PrefStyles.pageStep}>
                    <h2 className={PrefStyles.subtitle}>Step 2: Select your allergies</h2>

                    <div className={PrefStyles.list} >
                        {allergies.map((allergy) => (
                            <div key={allergy.id} className={PrefStyles.checkbox}>
                                <input id={allergy.name} className={PrefStyles.checkboxInput} type="checkbox" checked={selectedAllergies.includes(allergy.id)} onChange={() => toggleAllergy(allergy.id)}/>
                                <label htmlFor={allergy.name} className={PrefStyles.checkboxLabel}>{allergy.name}</label>
                            </div>
                        ))}
                    </div>
                    
                    <div className={PrefStyles.buttons}>
                        <button className={ButtonStyles.button} onClick={() => setStep(1)}>Back</button>

                        <button className={ButtonStyles.button} onClick={handleComplete}>
                            Complete
                        </button>
                    </div>
                </div>
            )}
    </div>
  );
}