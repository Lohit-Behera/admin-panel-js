import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Collaboration } from "../model/collaborationModel.js";
import Joi from "joi";

const createCollaboration = asyncHandler(async (req, res) => {
    // joi schema for validation
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        company: Joi.string().allow("").optional(),
        message: Joi.string().required(),
    });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    // Extract validated fields
    const { firstName, lastName, email, phoneNumber, company, message } = value;

    // Create collaboration
    const collaboration = await Collaboration.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        message,
    });

    if (!collaboration) {  
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Failed to create collaboration"));
    }

    // Send response
    return res
        .status(200)
        .json(new ApiResponse(200, collaboration, "Collaboration created successfully"));
});

const allCollaborations = asyncHandler(async (req, res) => {
    // get all collaborations
    const collaborations = await Collaboration.find().sort({ createdAt: -1 });
    // validate the collaborations
    if (!collaborations || collaborations.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Collaborations not found"));
    }
    // send the response
    return res
        .status(200)
        .json(new ApiResponse(200, collaborations, "Collaborations found successfully"));
});

const deleteCollaboration = asyncHandler(async (req, res) => {
    // get collaboration id from the params
    const { collaborationId } = req.params;
    // get the collaboration
    const collaboration = await Collaboration.findById(collaborationId);
    // validate the collaboration
    if (!collaboration) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Collaboration not found"));
    }
    // delete the collaboration
    await Collaboration.findByIdAndDelete(collaboration._id);
    // send the response
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Collaboration deleted successfully"));
});

export { createCollaboration, allCollaborations, deleteCollaboration };