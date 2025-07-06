import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: Object,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: Object,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});
export default mongoose.model("Category", categorySchema);