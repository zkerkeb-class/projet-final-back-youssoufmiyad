import Category from '../models/Category.js';
import { generateCategorySlug } from '../utils/generateSlug.js';

async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function getCategoryById(req, res) {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function getCategoryBySlug(req, res) {
  const categorySlug = req.params.slug;

  try {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function addCategory(req, res) {
  const { name, description, imageUrl } = req.body;

  if (!name || !name.fr || !name.en) {
    return res.status(400).json({ message: 'Name is required in both languages' });
  }

  try {
    const slug = await generateCategorySlug(name.en ?? name.fr);
    const newCategory = new Category({
      name,
      slug,
      description,
      imageUrl,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function modifyCategory(req, res) {
    const categoryId = req.params.id;
    const { name, description, imageUrl } = req.body;
    
    if (!name || !name.fr || !name.en) {
        return res.status(400).json({ message: 'Name is required in both languages' });
    }
    
    try {
        const slug = await generateCategorySlug(name.en ?? name.fr);
        const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, slug, description, imageUrl },
        { new: true }
        );
    
        if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
        }
    
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: `Server error : ${error}` });
    }
    }

async function deleteCategory(req, res) {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

export default {
  getCategories,
  getCategoryById,
    getCategoryBySlug,
    addCategory,
    modifyCategory,
    deleteCategory,
};