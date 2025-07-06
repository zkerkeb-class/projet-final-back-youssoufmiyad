import User from "../models/User.js";
import {generateUserSlug} from "../utils/generateSlug.js";
import { PASSWORD_REGEX } from "../utils/regex.js";
import bcrypt from "bcryptjs";

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserBySlug(req, res) {
  const userSlug = req.params.slug;
  try {
    const user = await User.findOne({ slug: userSlug });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function modifyUser(req, res) {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Création d'un nouvel utilisateur (méthode réservée aux admins)
async function addUser(req, res) {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email adress already used" });
    }
    if (!password.match(PASSWORD_REGEX)){
      return res.status(400).json({
        message: "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const slug = await generateUserSlug(firstName, lastName);
    const hashedPassword = await bcrypt.hash(password,  10); // Hashage du mot de passe avec bcrypt

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      slug,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function getUserRecipes(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("recipes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.recipes);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function getSavedRecipes(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function addRecipeToUser(req, res) {
  const userId = req.params.id;
  const { recipeId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedRecipes: recipeId } }, // Utilise $addToSet pour éviter les doublons
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export default {
  getUsers,
  getUserById,
  getUserBySlug,
  modifyUser,
  addUser,
  addRecipeToUser,
  deleteUser,
  getUserRecipes,
  getSavedRecipes
};
