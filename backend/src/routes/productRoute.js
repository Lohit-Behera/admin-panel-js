import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import {
  createProduct,
  getProduct,
  getAllProducts,
  getRecentProducts,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = Router();
// create product
productRouter.post(
  "/create",
  upload.fields([{ name: "thumbnail" }, { name: "bigImage" }]),
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
  upload.single("thumbnail"),
  resizeImage,
  updateProduct
);
export default productRouter;
