import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Banner } from "../model/bannerModel.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";

// create banner
const createBanner = asyncHandler(async (req, res) => {
    // get the images
    const imageOne = req.files.imageOne[0];
    const imageTwo = req.files.imageTwo[0];
    const imageThree = req.files.imageThree[0];
    // validate the images
    const images = [imageOne, imageTwo, imageThree];
    images.map(async (image, index) => {
        if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
            return res.status(400).json(new ApiResponse(400, null, `Invalid image ${index + 1} format`));
        }
    })
    // upload the images
    const imageOneUrl = await uploadFile(imageOne);
    const imageTwoUrl = await uploadFile(imageTwo);
    const imageThreeUrl = await uploadFile(imageThree);
    // validate the images
    if (!imageOneUrl || !imageTwoUrl || !imageThreeUrl) {
        return res.status(500).json(new ApiResponse(500, null, "Image upload failed"));
    }
    // create the banner
    const banner = await Banner.create({
        imageOne: imageOneUrl,
        imageTwo: imageTwoUrl,
        imageThree: imageThreeUrl
    })
    // validate the banner
    const createdBanner = await Banner.findById(banner._id);
    if (!createdBanner) {
        return res.status(500).json(new ApiResponse(500, null, "Banner creation failed"));
    }
    // send the response
    return res.status(200).json(new ApiResponse(200, banner, "Banner created successfully"));
})

// get banner
const getBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findOne({});
    if (!banner) {
        return res.status(404).json(new ApiResponse(404, null, "Banner not found"));
    }
    return res.status(200).json(new ApiResponse(200, banner, "Banner found successfully"));
})

// update banner
const updateBanner = asyncHandler(async (req, res) => {
    // get the banner
    const banner = await Banner.findById(req.params.id);
    // validate the banner
    if (!banner) {
        return res.status(404).json(new ApiResponse(404, null, "Banner not found"));
    }
    // get the images
    const imageOne = req.files.imageOne[0];
    const imageTwo = req.files.imageTwo[0];
    const imageThree = req.files.imageThree[0];
    // validate the images
    if (!imageOne || !imageTwo || !imageThree) {
        return res.status(400).json(new ApiResponse(400, null, "There is no image to update"));
    }
    // validate the images and upload them
    if (imageOne) {
        if (imageOne.mimetype !== "image/jpeg" && imageOne.mimetype !== "image/png") {
            return res.status(400).json(new ApiResponse(400, null, "Invalid image 1 format"));
        }
        const publicId = banner.imageOne.split('/').pop().split('.')[0];
        await deleteFile(publicId);
        const imageOneUrl = await uploadFile(imageOne);
        banner.imageOne = imageOneUrl;
    }
    if (imageTwo) {
        if (imageTwo.mimetype !== "image/jpeg" && imageTwo.mimetype !== "image/png") {
            return res.status(400).json(new ApiResponse(400, null, "Invalid image 2 format"));
        }
        const publicId = banner.imageTwo.split('/').pop().split('.')[0];
        await deleteFile(publicId);
        const imageTwoUrl = await uploadFile(imageTwo);
        banner.imageTwo = imageTwoUrl;
    }
    if (imageThree) {
        if (imageThree.mimetype !== "image/jpeg" && imageThree.mimetype !== "image/png") {
            return res.status(400).json(new ApiResponse(400, null, "Invalid image 3 format"));
        }
        const publicId = banner.imageThree.split('/').pop().split('.')[0];
        await deleteFile(publicId);
        const imageThreeUrl = await uploadFile(imageThree);
        banner.imageThree = imageThreeUrl;
    }
    
    const updatedBanner = await banner.save({ validateBeforeSave: false });
    // validate the updated banner
    if (!updatedBanner) {
        return res.status(500).json(new ApiResponse(500, null, "Banner update failed"));
    }
    // send the response
    return res.status(200).json(new ApiResponse(200, updatedBanner, "Banner updated successfully"));
})

export { createBanner, getBanner, updateBanner }