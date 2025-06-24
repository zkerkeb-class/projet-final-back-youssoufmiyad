import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "chef"],
    default: "user",
  },
  slug:{
    type: String,
    required: true,
    unique: true,
  },
  savedRecipes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: false,
    },
  ],
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: false,
    },
  ],
});

export default mongoose.model("User", userSchema);
