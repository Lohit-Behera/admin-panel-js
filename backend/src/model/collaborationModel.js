import mongoose, { Schema } from "mongoose";

const collaborationSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const Collaboration = mongoose.model("Collaboration", collaborationSchema);