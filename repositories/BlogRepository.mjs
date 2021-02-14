import mongodbpkg from 'mongodb';
import Blog from "../models/Blog.mjs";
const {MongoClient: mongo} = mongodbpkg;

export default class BlogRepository {

    async getAllBlogs() {
        return Blog.find({}).populate('blogentries').exec();
    }

    async getBlogById(blogid) {
        return Blog.findById(blogid).populate('blogentries').exec();
    }

    async insertBlogentry(persistedBlogentry) {
        return await Blog.findByIdAndUpdate(
            persistedBlogentry.blog,
            {$push: {"blogentries": persistedBlogentry._id}},
            {safe: true, upsert: true, new: true}
        ).exec();
    }

    async removeBlogentry(blogentryToRemove) {
        return Blog.updateOne(
            {_id: blogentryToRemove.blog},
            {$pull: {"blogentries": blogentryToRemove._id}},
            {safe: true, upsert: true, new: true}
        ).exec();
    }

    async createBlog(newBlog) {
        const newblog = new Blog({
            title: newBlog.title,
            description: newBlog.description,
        });
        return await newblog.save();
    }
}
