import mongoose from 'mongoose';
const recipeSchema = new mongoose.Schema({
    title: {
        type: Object,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    area:{
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    ingredients: [{
        type: Object,
        required: true,
    }],
    tags: [{
        type: String,
        required: true,
    }],
    imageUrl: {
        type: String,
        required: true,
    },
    videoUrl:{
        type: String,
        required: false,
    },
    chef:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default:  null,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Recipe', recipeSchema);