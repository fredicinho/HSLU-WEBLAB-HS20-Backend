import mongoose from "mongoose";

const Schema = mongoose.Schema;

let blog = new Schema(
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
            type: String
        },
        blogentries: [
            {
                    type: mongoose.Schema.ObjectId,
                    ref: 'blogentries'
            }
        ],
        // TODO: Insert User
    },
    {
        collection: "blogs"
    }
);

export default mongoose.model("blogs", blog);
