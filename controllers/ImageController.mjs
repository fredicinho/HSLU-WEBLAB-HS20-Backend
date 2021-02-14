import dotenv from "dotenv";
import express from "express";
import path from "path";
import multer from "multer";
import * as fs from "fs";

dotenv.config();
const UPLOAD_PATH = path.resolve();
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {fileSize: 1000000, files: 5}
})

let router = express.Router();

router.post('/', upload.array('image', 5), (req, res, next) => {
    const images = req.files.map((file) => {
        return {
            filename: file.filename,
            originalname: file.originalname
        };
    });
    Image.insertMany(images, (err, result) => {
        if (err) return res.sendStatus(404)
        res.json(result)
    });
});

router.get('/:id', (req, res) => {
    Image.findOne({_id: req.params.id}, (err, image) => {
        if (err) {
            return res.sendStatus(404);
        };
        fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res);
    });
});

export default router;

