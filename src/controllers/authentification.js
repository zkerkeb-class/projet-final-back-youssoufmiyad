import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { PASSWORD_REGEX } from "../utils/regex.js";
import { generateUserSlug } from "../utils/generateSlug.js";

async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email adress already used" });
    }

    if (!password.match(PASSWORD_REGEX)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const slug = await generateUserSlug(firstName, lastName);
    const hashedPassword = await bcrypt.hash(password,  10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      slug,
    });

    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function login(req, res) {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn:  remember ? "7d" : "24h",
    });
    res.status(200).json({ token:token, user:{_id:user._id, firstName: user.firstName, lastName:user.lastName, email:user.email, role:user.role, slug:user.slug, savedRecipes:user.savedRecipes, recipes:user.recipes} });
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

async function changePassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.find({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.hashedPassword = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server error : ${error}` });
  }
}

export default {
  register,
  login,
};
