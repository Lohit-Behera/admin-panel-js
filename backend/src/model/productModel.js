import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
    },
    productDescriptionImage:{
      type: String,
    },
    productDetail: {
      type: String,
      required: true,
    },
    affiliateLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
