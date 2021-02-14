import mongodbpkg from 'mongodb';
import Blogentry from "../models/Blogentry.mjs";
import BlogRepository from "./BlogRepository.mjs";

const {MongoClient: mongo} = mongodbpkg;


export default class BlogentryRepository {

    async getAllBlogentries() {
        return Blogentry.find({}).populate('blog').exec();
    }

    async getBlogentryById(blogentryid) {
        return Blogentry.findById(blogentryid);
    }

    async getBlogentriesByBlogId(blogid) {
        return Blogentry.find({blog: blogid});
    }

    async insertComment(newComment) {
        return await Blogentry.findByIdAndUpdate(
            newComment.blogentry,
            {$push: {"comments": newComment._id}},
            {safe: true, upsert: true, new: true}
        ).exec();
    }

    async createBlogentry(newBlogentry) {
        const newblogentry = new Blogentry({
            title: newBlogentry.title,
            description: newBlogentry.description,
            blog: newBlogentry.blogid,
        });
        let persistedBlogentry = await newblogentry.save();
        let blogrepository = new BlogRepository();
        let updatedBlog = await blogrepository.insertBlogentry(persistedBlogentry);
        if (updatedBlog) {
            return persistedBlogentry;
        } else {
            throw new Error("Blogentry couldn't be inserted into the Blog!");
        }
    }

}
