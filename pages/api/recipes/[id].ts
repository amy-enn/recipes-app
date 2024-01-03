import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';


interface Recipe {
    recipe_name: string;
    recipe_id: number;
    category: string;
    ingredients: Ingredient[];
    instructions: string[];
    description: string;
}

interface Ingredient {
    ingredient_name: string;
    quantity: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Recipe | { error: string }>) {
    let { id } = req.query;

    // load recipes.json
    let filePath = path.join(process.cwd(), 'public', 'recipes.json');
    let jsonData = fs.readFileSync(filePath, 'utf8');
    let recipes: Recipe[] = JSON.parse(jsonData);

    // find the right recipe (by id)
    let recipe = recipes.find(r => r.recipe_id === parseInt(id as string, 10));

    if (recipe) {
        res.status(200).json(recipe);
    } else {
        res.status(404).json({ error: 'Recipe not found' });
    }
}