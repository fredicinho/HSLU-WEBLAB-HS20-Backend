import mongoose from "mongoose";

const Schema = mongoose.Schema;

let blogentry = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        createDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        description: {
            type: String,
            required: true
        },
        updateDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        blog: {
            type: mongoose.Schema.ObjectId,
            ref: 'blogs'
        },
        comments: [{
            type: mongoose.Schema.ObjectId,
            ref: 'comments'
        }]
        // TODO: Insert User
    },
    {
        collection: "blogentries"
    }
);

export default mongoose.model("blogentries", blogentry);
