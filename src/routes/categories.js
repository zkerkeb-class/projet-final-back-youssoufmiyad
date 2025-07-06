import express from 'express';
import categoryController from '../controllers/categories.js';

const categoryRouter = express.Router();

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/id/:id', categoryController.getCategoryById);
categoryRouter.get('/:slug', categoryController.getCategoryBySlug);
categoryRouter.post('/', categoryController.addCategory);
categoryRouter.put('/:id', categoryController.modifyCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);

export default categoryRouter;