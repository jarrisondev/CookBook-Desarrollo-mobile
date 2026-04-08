import { createContext, useEffect, useState } from "react";
import { recipesMockData } from "../mockdata/recipesMockData";
import { COOKING_TIPS } from "../mockdata/cookingTipsData";

export const RecipesContext = createContext();

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState(recipesMockData);
  const [loading, setLoading] = useState(true)
  // tips
  const [tips] = useState(COOKING_TIPS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")


  useEffect(() => {
    const timer = setTimeout(() => {
      setRecipes(recipesMockData)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <RecipesContext.Provider
      value={{ recipes, setRecipes, loading, setLoading, tips, currentIndex, setCurrentIndex, progressLabel, setProgressLabel }}
    >
      {children}
    </RecipesContext.Provider>
  );
}
