import express from "express";
import CommentRepository from "../repositories/CommentRepository.mjs";
let router = express.Router();

router.get('/:id', getComment, (req, res) => {
    res.status(200).json(res.comment);
});

/**
 * TODO: Should it be possible to update Comments?
router.patch('/:id', getComment, async (req, res) => {
    if (req.body.text != null) {
        res.comment.text = req.body.text;
    }

    try {
        const updateBlog = await res.blog.save();
        res.status(200).json(updateBlog);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
 */

router.delete('/:id', getComment, async (req, res) => {
    try {
        await res.comment.remove();
        res.status(200).json({ message: 'Deleted This Comment' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/', ((req, res, next) => {
    let repository = new CommentRepository();
    repository.getAllComments()
        .then((comments) => {
            res.status(200).json(comments)
        })
        .catch((error) => {
            res.status(500).json({
                message: "Fail!",
                error: error.message
            });
        });
}));

router.post('/', (req, res) => {
    let repository = new CommentRepository();
    repository.createComment(req.body)
        .then(newComment => res.status(201).json(newComment))
        .catch((error) => {
            res.status(500).json({
                message: "Failed to create the new Comment",
                error: error.message,
            });
        });
});

// Middleware
async function getComment(req, res, next) {
    let repository = new CommentRepository();
    try {
        let comment = await repository.getCommentById(req.params.id)
        if (comment == null) {
            return res.status(404).json({ message: 'Cant find Comment'})
        }
        res.comment = comment;
        next();
    } catch(err){
        return res.status(500).json({ message: err.message })
    }
}

export default router;
