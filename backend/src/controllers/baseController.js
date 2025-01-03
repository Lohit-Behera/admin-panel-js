import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../model/productModel.js";
import { Blog } from "../model/blogModel.js";
import { Category } from "../model/categoryModel.js";

const getCount = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments();
  const blogCount = await Blog.countDocuments();
  const categoryCount = await Category.countDocuments();
  return res
    .status(200)
    .json(new ApiResponse(200, { productCount, blogCount, categoryCount }));
});

export { getCount };
