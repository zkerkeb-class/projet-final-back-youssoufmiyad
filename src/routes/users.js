import express from 'express';
import userController from '../controllers/users.js';

const userRouter = express.Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/id/:id', userController.getUserById);
userRouter.get('/:slug', userController.getUserBySlug);
userRouter.put('/:id', userController.modifyUser);
userRouter.post('/', userController.addUser);
userRouter.get('/:id/recipes', userController.getUserRecipes);
userRouter.get('/:id/saved-recipes', userController.getSavedRecipes);
userRouter.post('/:id/add-recipe', userController.addRecipeToUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;