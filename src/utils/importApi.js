import https from "https";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import translate from "translate";
import { generateRecipeSlug } from "./generateSlug.js";

translate.engine = "google";

function transformMeal(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  const slug = generateRecipeSlug(meal.strMeal, null);
  const tags = meal.strTags
    ? meal.strTags.split(",").map((tag) => tag.trim())
    : [];

  let recipe = {
    title: { fr: "", en: meal.strMeal },
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    ingredients,
    tags,
    imageUrl: meal.strMealThumb,
    videoUrl: meal.strYoutube || null,
    slug,
  };
  return recipe;
}

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Mirmaton");
    console.log("✅ Connecté à MongoDB");

    const letters = [..."abcdefghijklmnopqrstuvwxyz"];

    for (const letter of letters) {
      await fetchMealsByLetter(letter);
    }

    console.log("🎉 Import terminé");
  } catch (error) {
    console.error("Erreur MongoDB:", error);
  } finally {
    await mongoose.disconnect();
  }
}

function fetchMealsByLetter(letter) {
  return new Promise((resolve) => {
    const options = {
      host: "www.themealdb.com",
      path: `/api/json/v1/1/search.php?f=${letter}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", async () => {
        try {
          const parsed = JSON.parse(data);
          const meals = parsed.meals;

          if (!meals) {
            console.log(`🔸 Aucun repas pour la lettre '${letter}'`);
            return resolve();
          }

          const recipes = meals.map(transformMeal);
          await Recipe.insertMany(recipes, { ordered: false });
          console.log(
            `✅ Inséré ${recipes.length} recettes pour la lettre '${letter}'`
          );
        } catch (error) {
          console.error(
            `❌ Erreur lors du traitement de la lettre '${letter}' :`,
            error.message
          );
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error(`❌ Requête échouée pour '${letter}':`, error.message);
      resolve();
    });

    req.end();
  });
}

main();
