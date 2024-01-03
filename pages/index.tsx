import { useState, useEffect } from "react";
import Image from "next/image";
import cupcake from '../public/cupcake.png';
import RecipeModal from "../components/RecipeModal";


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


export default function Home() {
  const [data, setData] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  useEffect(() => {
    const recipeUrl = "/recipes.json";
    fetch(recipeUrl)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error fetching data", error);
        setLoading(false);
      });
  }, []);

  const allCategories = new Set(data.map((recipe) => recipe.category));
  const categoryList = Array.from(allCategories);



  function handleSearchChange(event: any) {
    setSearchTerm(event.target.value);
  };


  // const filteredData = data.filter((recipe) =>
  //   recipe.ingredients.some(ingredient =>
  //     ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  // );

  const filteredData = data
    .filter((recipe) =>
      selectedCategory ? recipe.category === selectedCategory : true
    )
    .filter((recipe) =>
      searchTerm
        ? recipe.ingredients.some((ingredient) =>
          ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true
    )
    .sort((a, b) => a.recipe_name.localeCompare(b.recipe_name));


  function handleRecipeClick(recipeId: number) {
    const recipe = data.find(r => r.recipe_id === recipeId);
    setSelectedRecipe(recipe ?? null);
  };


  function closeRecipeModal() {
    setSelectedRecipe(null);
  }

  const sortedFilteredData = [...filteredData].sort((a, b) =>
    a.recipe_name.localeCompare(b.recipe_name)
  );

  return (
    <>
      <header>
        <div id="headerLogoTitle">
          <Image src={cupcake} alt="cute cupcake logo" className="logo" width={64} height={75} />
          <h1 id="headerTitle">My Recipes</h1>
        </div>
        <div id="navLinks">
          <a href="" className="nav-link">•GitHub•</a>
          <a href="" className="nav-link">•Portfolio•</a>
        </div>
      </header>



      <div id="contentDiv">
        {/* <h2>Index</h2> */}
        {loading ? (
          <p>Loading Delicious...</p>
        ) : (
          <div>

            <div id="searchDiv">
              <h1 id="indexTitle">~ Index ~</h1>
              <input
                type="text"
                placeholder="Search by ingredient..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              defaultValue=""
            >
              <option value="">Select a category...</option>
              {categoryList.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div id="searchResults">
              {filteredData.length > 0 ? (
                sortedFilteredData.map((recipe) => (
                  <div key={recipe.recipe_id} className="search-result-item">
                    <a onClick={() => handleRecipeClick(recipe.recipe_id)}>
                      {recipe.recipe_name}
                    </a>
                  </div>
                ))
              ) : (
                <p>No matching recipes found.</p>
              )}
            </div>


            {selectedRecipe && (
              <RecipeModal recipeId={selectedRecipe.recipe_id} closeRecipeFx={closeRecipeModal} />
            )}

          </div>


        )}
      </div>


    </>
  );
}
