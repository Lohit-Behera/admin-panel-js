import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import {
  createProduct,
  getProduct,
  getAllProducts,
  getRecentProducts,
  updateProduct,
  deleteProduct,
  searchProduct
} from "../controllers/productController.js";

const productRouter = Router();
// create product
productRouter.post(
  "/create",
  upload.fields([{ name: "images", maxCount: 5 }, { name: "thumbnail" }, { name: "productDescriptionImage"}]),
  resizeImage,
  createProduct
);
// get one product
productRouter.get("/:productId", getProduct);
// get all products
productRouter.get("/get/all", getAllProducts);
// get recent products
productRouter.get("/get/recent", getRecentProducts);
// update product
productRouter.patch(
  "/update/:productId",
  upload.fields([{ name: "images", maxCount: 5 }]),
  resizeImage,
  updateProduct
);
// delete product
productRouter.delete("/delete/:productId", deleteProduct);

// search product
productRouter.get("/", searchProduct);

export default productRouter;