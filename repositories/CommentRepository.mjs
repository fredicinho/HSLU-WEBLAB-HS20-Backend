import mongodbpkg from 'mongodb';
import Comment from "../models/Comment.mjs";
import BlogentryRepository from "./BlogentryRepository.mjs";
const {MongoClient: mongo} = mongodbpkg;

export default class CommentRepository {

    async getAllComments() {
        return Comment.find({}).exec();
    }

    async getCommentById(commentid) {
        return Comment.findById(commentid).exec();
    }

    async removeBlogentry(blogentryToRemove) {
        return Blog.updateOne(
            {_id: blogentryToRemove.blog},
            {$pull: {"blogentries": blogentryToRemove._id}},
            {safe: true, upsert: true, new: true}
        ).exec();
    }

    async createComment(newComment) {
        const comment = new Comment({
            text: newComment.text,
            blogentry: newComment.blogentry,
        });
        let persistedComment = await comment.save();
        let blogentryRepository = new BlogentryRepository();
        let updatedBlogentry = await blogentryRepository.insertComment(persistedComment);
        if (updatedBlogentry) {
            return persistedComment;
        } else {
            throw new Error("Blogentry couldn't be inserted into the Blog!");
        }

    }
}
