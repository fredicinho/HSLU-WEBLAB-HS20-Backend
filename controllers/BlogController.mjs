import BlogRepository from "../repositories/BlogRepository.mjs";
import express from "express";
let router = express.Router();

router.get('/:id', getBlog, (req, res) => {
    res.status(200).json(res.blog);
});

router.patch('/:id', getBlog, async (req, res) => {
    if (req.body.title != null) {
        res.blog.title = req.body.title;
    }

    if (req.body.description != null) {
        res.blog.description = req.body.description;
    }

    try {
        const updateBlog = await res.blog.save();
        res.status(200).json(updateBlog);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', getBlog, async (req, res) => {
    try {
        await res.blog.remove();
        res.status(200).json({ message: 'Deleted this Blog' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/', ((req, res, next) => {
    let repository = new BlogRepository();
    repository.getAllBlogs()
        .then((blogs) => {
            res.status(200).json(blogs)
        })
        .catch((error) => {
            res.status(500).json({
                message: "Fail!",
                error: error.message
            });
        });
}));

router.post('/', (req, res) => {
    let repository = new BlogRepository();
    repository.createBlog(req.body)
        .then(newBlog => res.status(201).json(newBlog))
        .catch((error) => {
            res.status(500).json({
                message: "Failed to create the new Blog",
                error: error.message,
            });
        });
});

// Middleware
async function getBlog(req, res, next) {
    let repository = new BlogRepository();
    try {
        let blog = await repository.getBlogById(req.params.id)
        if (blog == null) {
            return res.status(404).json({ message: 'Cant find Blog'})
        }
        res.blog = blog;
        next();
    } catch(err){
        return res.status(500).json({ message: err.message })
    }
}

export default router;
