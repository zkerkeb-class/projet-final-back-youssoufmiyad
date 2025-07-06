import express from 'express';
import recipesController from '../controllers/recipes.js';

const recipeRouter = express.Router();
recipeRouter.get('/', recipesController.getRecipes);
recipeRouter.get('/:slug', recipesController.getRecipeBySlug);
recipeRouter.get('/id/:id', recipesController.getRecipeById);
recipeRouter.post('/', recipesController.addRecipe);
recipeRouter.put('/:id', recipesController.modifyRecipe);
recipeRouter.delete('/:id', recipesController.deleteRecipe);
recipeRouter.put('/:id/chef/:chefId', recipesController.associateRecipeWithChef);

export default recipeRouter;