import express from 'express';
import authController from '../controllers/authentification.js';

const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.register);

export default authRouter;