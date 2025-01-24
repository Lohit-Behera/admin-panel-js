import { Product } from "../model/productModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";
import Joi from "joi";

const createProduct = asyncHandler(async (req, res) => {
  // Joi schema for validation
  const ProductSchema = Joi.object({
    name: Joi.string().min(3).max(500).required(),
    productDescription: Joi.string().allow(""),
    productDetail: Joi.string().min(10).required(),
    affiliateLink: Joi.string().uri().required(),
    category: Joi.string().required(),
    size: Joi.string().min(1).required(),
    sellingPrice: Joi.number().positive().required(),
    originalPrice: Joi.number().positive().required(),
    discount: Joi.number().required().min(0).max(100),
    isPublic: Joi.boolean().required(),
  });

  // Validate request body
  const { error, value } = ProductSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  
  // Extract validated fields
  const {
    name,
    productDescription,
    productDetail,
    affiliateLink,
    sellingPrice,
    originalPrice,
    discount,
    category,
    size,
    isPublic,
  } = value;

  // get images from the request
  const images = req.files.images;
  
  // validate the image
  if (!images || images.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Thumbnail is required"));
  }
  
  // upload images to cloudinary
  const imagesUrls = await Promise.all(
    images.map(async (file) => {
      const url = await uploadFile(file);
      if (!url || typeof url !== "string") {
        return res
          .status(500)
          .json(new ApiResponse(500, null, "Image upload failed"));
      }
      return url;
    })
  );
  // validate the image url
  if (!imagesUrls || imagesUrls.length === 0) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Images upload failed"));
  }
  // create the product
  const product = await Product.create({
    name,
    productDescription,
    productDetail,
    affiliateLink,
    originalPrice,
    discount,
    sellingPrice,
    category,
    size,
    images: imagesUrls,
    isPublic,
  });
  // validate the product creation
  const createdProduct = await Product.findById(product._id);
  if (!createdProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product creation failed"));
  }
  // send the response
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdProduct.name, "Product created successfully")
    );
});

const getProduct = asyncHandler(async (req, res) => {
  // get product id from the params
  const { productId } = req.params;
  // get the product
  const product = await Product.findById(productId);
  // validate the product
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product found successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  // Build the aggregation pipeline
  const products = await Product.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        name: 1,
        category: 1,
        images: 1,
        sellingPrice: 1,
        discount: 1,
        originalPrice: 1,
        isPublic: 1,
      },
    },
  ]);

  // Validate the products
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }

  // Send the response
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

// get recent 4 products
const getRecentProducts = asyncHandler(async (req, res) => {
  // get recent 4 products
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .select("_id name price thumbnail affiliateLink originalPrice");
  // validate the products
  if (!products) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  // get product id from the params
  const { productId } = req.params;

  // Joi schema for validation
  const ProductSchema = Joi.object({
    name: Joi.string().optional(),
    productDescription: Joi.string().optional().allow(""),
    productDetail: Joi.string().optional(),
    category: Joi.string().optional(),
    affiliateLink: Joi.string().uri().optional(),
    sellingPrice: Joi.number().positive().optional(),
    originalPrice: Joi.number().positive().optional(),
    discount: Joi.number().positive().optional(),
    size: Joi.string().optional(),
    isPublic: Joi.boolean().optional(),
  });

  // Validate request body
  const { error, value } = ProductSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // get the product
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }

  // Update fields if they are provided and different
  const fieldsToUpdate = [
    "name",
    "productDescription",
    "productDetail",
    "category",
    "affiliateLink",
    "sellingPrice",
    "originalPrice",
    "discount",
    "size",
    "isPublic",
  ];

  // get images from the request
  const images = req.files.images;
  
  // validate the image
  if (images) {
    // upload images to cloudinary
  const imagesUrls = await Promise.all(
    images.map(async (file) => {
      const url = await uploadFile(file);
      if (!url || typeof url !== "string") {
        return res
          .status(500)
          .json(new ApiResponse(500, null, "Image upload failed"));
      }
      return url;
    })
  );
    // validate the image url
    if (!imagesUrls || imagesUrls.length === 0) {
      return res
      .status(500)
      .json(new ApiResponse(500, null, "Images upload failed"));
    }
    // delete the existing images from cloudinary
    product.images.forEach(async (image) => {
      const publicId = image.split('/').pop().split('.')[0];
      await deleteFile(publicId, res)
    })
    product.images = imagesUrls
  }
  

  let hasUpdates = false;

  fieldsToUpdate.forEach((field) => {
    if (value[field] !== undefined && value[field] !== product[field]) {
      product[field] = value[field];
      hasUpdates = true;
      
    }
  });

  if (!hasUpdates && !images) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No fields to update"));
  }

  // Save updated product
  const updatedProduct = await product.save({ validateBeforeSave: false });
  if (!updatedProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product update failed"));
  }
 
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct._id, "Product updated successfully")
    );
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  // get product id from the params
  const { productId } = req.params;
  // get the product
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  // delete images from cloudinary
  if (product.images) {
    product.images.forEach(async (image) => {
      const publicId = image.split('/').pop().split('.')[0];
      await deleteFile(publicId, res)
    })
  }
  // delete the product
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product delete failed"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});


// search product
const searchProduct = asyncHandler(async (req, res) => {
  // get search text from the request
  const searchText = req.query.search;
  // validate the search text
  if (!searchText) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Search text is required"));
  }
  // search products
  const products = await Product.find({
    name: { $regex: searchText, $options: "i" },
  });
  // validate the products
  if (!products) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

export {
  createProduct,
  getProduct,
  getAllProducts,
  getRecentProducts,
  updateProduct,
  deleteProduct,
  searchProduct,
};
