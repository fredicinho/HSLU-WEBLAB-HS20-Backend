import mongoose from "mongoose";
const Schema = mongoose.Schema;

let comment = new Schema(
    {
        createDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        text: {
            type: String,
            required: true
        },
        blogentry: {
            type: mongoose.Schema.ObjectId,
            ref: 'blogentries'
        }
        // TODO: Insert User
    },
    {
        collection: "comments"
    }
);

export default mongoose.model("comments", comment);
