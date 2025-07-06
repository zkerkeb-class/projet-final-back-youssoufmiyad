import https from "https";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import translate from "translate";
import { generateRecipeSlug, generateCategorySlug } from "./generateSlug.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../../.env" });

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

async function transformCategory(category) {
  let slug = await generateCategorySlug(category.strCategory);
  return {
    name: {
      fr: category.strCategory,
      en: category.strCategory,
    },
    slug: slug,
    description: {
      fr: category.strCategoryDescription || "",
      en: category.strCategoryDescription || "",
    },
    imageUrl: category.strCategoryThumb || "",
  };
}

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Mirmaton");
    console.log("✅ Connecté à MongoDB");

    const letters = [..."abcdefghijklmnopqrstuvwxyz"];

    for (const letter of letters) {
      await fetchMealsByLetter(letter);
    }

    await fetchCategories();

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

function fetchCategories() {
  return new Promise((resolve) => {
    const options = {
      host: "www.themealdb.com",
      path: "/api/json/v1/1/categories.php",
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
          const categories = parsed.categories;

          if (!categories) {
            console.log("🔸 Aucune catégorie trouvée");
            return resolve();
          }

          const transformedCategories = await Promise.all(
            categories.map(transformCategory)
          );
          await Category.insertMany(transformedCategories, { ordered: false });
          console.log(`✅ ${transformedCategories.length} catégories insérées`);
          resolve();
        } catch (error) {
          console.error(
            "❌ Erreur lors de la récupération des catégories :",
            error.message
          );
          resolve();
        }
      });
    });
    req.on("error", (error) => {
      console.error("❌ Requête échouée pour les catégories :", error.message);
      resolve();
    });
    req.end();
  });
}

main();
