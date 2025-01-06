import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    imageOne: {
      type: String,
      required: true,
    },
    imageTwo: {
      type: String,
      required: true,
    },
    imageThree: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model("Banner", bannerSchema);