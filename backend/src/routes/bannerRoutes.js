import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";
import { createBanner, getBanner, updateBanner } from "../controllers/bannerController.js";

const bannerRouter = Router();

bannerRouter.post("/create", upload.fields([{ name: "imageOne" }, { name: "imageTwo" }, { name: "imageThree" }]), resizeImage, createBanner);
bannerRouter.get("/get", getBanner);
bannerRouter.patch("/update", upload.fields([{ name: "imageOne" }, { name: "imageTwo" }, { name: "imageThree" }]), resizeImage, updateBanner);

export default bannerRouter