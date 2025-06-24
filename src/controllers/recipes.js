import Recipe from "../models/Recipe.js";
import { generateRecipeSlug } from "../utils/generateSlug.js";

async function getRecipes(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const allowedFilters = ["category", "area"];
    const options = {};

    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        options[key] = req.query[key];
      }
    });

    const totalRecipes = await Recipe.countDocuments(options);
    const totalPages = Math.ceil(totalRecipes / limit);
    const recipes = await Recipe.find(options).skip(skip).limit(limit);

    res.status(200).json({
      page,
      totalPages,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error : " + error.message });
  }
}

async function getRecipeById(req, res) {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getRecipeBySlug(req, res) {
  const recipeSlug = req.params.slug;
  try {
    const recipe = await Recipe.findOne({ slug: recipeSlug });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function addRecipe(req, res) {
  const { title, description, ingredients, instructions } = req.body;

  try {
    const slug = generateRecipeSlug(title);
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      slug,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function modifyRecipe(req, res) {
  const recipeId = req.params.id;
  const { title, description, ingredients, instructions } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { title, description, ingredients, instructions },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteRecipe(req, res) {
  const recipeId = req.params.id;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export default {
  getRecipes,
  getRecipeById,
  getRecipeBySlug,
  addRecipe,
  modifyRecipe,
  deleteRecipe,
};
