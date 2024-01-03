
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// interface PrintableRecipeProps {
//     recipeId: number;
// }

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


export default function PrintableRecipe() {
    const router = useRouter();
    const { id: recipeId } = router.query;
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

    useEffect(() => {
        if (recipeId) {
            fetch(`/api/recipes/${recipeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched recipe data:', data);
                    setRecipeData(data);
                })
                .catch(error => console.error('Error fetching recipe:', error));
        }
    }, [recipeId]);

    if (!recipeData) return <p>Loading recipe...</p>;

    return (
        <div id="printableRecipe">
            <style jsx global>{`
      body {
        background-color: white;
        margin: 3rem;
        padding: 0;
        font-family: monospace;
      }
    `}</style>
            <h1>{recipeData.recipe_name}</h1>
            <p>~ from My Recipes ~</p>
            <h4>Description</h4>
            <p>{recipeData.description}</p>
            <h4>Ingredients</h4>
            <ul>
                {recipeData.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.quantity}{" "}
                        {ingredient.ingredient_name.toLowerCase()}
                    </li>
                ))}
            </ul>
            <h4>Instructions</h4>
            <ul>
                {recipeData.instructions.map((instruction, index) => (
                    <li key={index}>
                        {instruction}
                    </li>
                ))}
            </ul>
        </div>
    );
}
