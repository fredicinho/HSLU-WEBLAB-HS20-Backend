import mongoose from "mongoose";

const Schema = mongoose.Schema;

let image = new Schema(
    {
        filename: {
            type: String,
            required: true
        },
        uploadDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        originalname: {
            type: String,
            required: true,
        },
    },
    {
        collection: "images"
    }
);

export default mongoose.model("images", image);
