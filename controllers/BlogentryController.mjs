import express from "express";
import BlogentryRepository from "../repositories/BlogentryRepository.mjs";
let router = express.Router();


router.get('/:id', getBlogentry, (req, res) => {
    res.status(200).json(res.blogentry);
});

router.patch('/:id', getBlogentry, async (req, res) => {
    let objectUpdated = false;
    if (req.body.title != null) {
        res.blogentry.title = req.body.title;
        objectUpdated = true;
    }

    if (req.body.description != null) {
        res.blogentry.description = req.body.description;
        objectUpdated = true;
    }

    if (req.body.blog != null) {
        res.blogentry.blog = req.body.blog;
    }

    if (objectUpdated) {
        res.blogentry.updateDate = new Date();
    }

    try {
        const updateBlog = await res.blogentry.save();
        res.status(200).json(updateBlog);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', getBlogentry, async (req, res) => {
    try {
        await res.blogentry.remove();
        res.status(200).json({ message: 'Deleted this Blogentry' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/', (req, res) => {
    let repository = new BlogentryRepository();
    repository.getAllBlogentries()
        .then((blogentries) => {
            res.status(200).json(blogentries)
        })
        .catch((error) => {
            res.status(500).json({
                message: "Fail!",
                error: error.message
            });
        });
});

router.post('/', (req, res) => {
    let repository = new BlogentryRepository();
    repository.createBlogentry(req.body)
        .then(newBlogentry => res.status(201).json(newBlogentry))
        .catch((error) => {
            res.status(500).json({
                message: "Failed to create the new Blogentry",
                error: error.message,
            });
        });
});


// Middleware
async function getBlogentry(req, res, next) {
    let repository = new BlogentryRepository();
    try {
        let blogentry = await repository.getBlogentryById(req.params.id)
        if (blogentry == null) {
            return res.status(404).json({ message: 'Cant find Blogentry'})
        }
        res.blogentry = blogentry;
        next();
    } catch(err){
        return res.status(500).json({ message: err.message })
    }
};

export default router;
