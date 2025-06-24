import express from 'express';
import userController from '../controllers/users.js';

const userRouter = express.Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/id/:id', userController.getUserById);
userRouter.get('/:slug', userController.getUserBySlug);
userRouter.put('/:id', userController.modifyUser);
userRouter.post('/', userController.addUser);
userRouter.post('/:id/recipes', userController.addRecipeToUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;