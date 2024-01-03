import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

interface RecipeModalProps {
    // recipe: RecipeData;
    recipeId: number;
    closeRecipeFx: () => void;
}

interface RecipeData {
    recipe_name: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
}

interface Ingredient {
    ingredient_name: string;
    quantity: string;
}


export default function RecipeModal({ recipeId, closeRecipeFx }: RecipeModalProps) {
    // const { recipeId, closeRecipeFx } = props;

    const [data, setData] = useState<RecipeData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (recipeId !== null) {
            let recipeUrl = `/api/recipes/${recipeId}`;

            fetch(recipeUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Recipe not found");
                    }
                    return response.json();
                })
                .then((result) => {
                    setData(result);
                })
                .catch((error) => {
                    setError(error.message);
                });
        } else {
            setData(null);
            setError(null);
        }
    }, [recipeId]);



    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <div id="recipeModalContent">
                <div className="recipe-card" key={data.recipe_name}>
                    <h2>{data.recipe_name}</h2>
                    <p>{data.description}</p>
                    <h4>Ingredients</h4>
                    <ul>
                        {data.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                ✦ {ingredient.quantity}{" "}
                                {ingredient.ingredient_name.toLowerCase()}
                            </li>
                        ))}
                    </ul>
                    <h4>Instructions</h4>
                    <ul>
                        {data.instructions.map((instruction, index) => (
                            <li key={index}>
                                ➸ {instruction}
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <a id="printingLink" href={`/printableRecipe/${recipeId}`} target="_blank">Print</a>

                    <button onClick={closeRecipeFx}>Close</button>
                </div>

            </div>
        </>
    );
}
