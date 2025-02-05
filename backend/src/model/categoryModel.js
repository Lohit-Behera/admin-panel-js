import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  subCategories: [subCategorySchema],
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);
