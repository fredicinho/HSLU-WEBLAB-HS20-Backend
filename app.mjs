import express from "express";
import dotenv from "dotenv";
import BlogController from "./controllers/BlogController.mjs";
import BlogentryController from "./controllers/BlogentryController.mjs"
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import ImageController from "./controllers/ImageController.mjs";
import {router as AuthController} from "./controllers/AuthController.mjs";
import CommentController from "./controllers/CommentController.mjs";

// Fetch environmentvariables from .env-File
dotenv.config();
process.env.TZ = 'Europe/Amsterdam';
console.log("Path of dirname");
console.log(process.cwd());

// Connect DB
mongoose.connect(process.env.DB_CONNECTIONSTRING, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

// Configure Server
let app = express();
app.use(express.json());
app.use(cors()); // Access-Control-Allow-Origin: *
app.use(bodyParser.json());


// Route to Controllers
app.use('/api/auth', AuthController);
app.use('/api/blog', BlogController);
app.use('/api/blogentry', BlogentryController);
app.use('/api/image', ImageController);
app.use('/api/comment', CommentController);

app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`)
});
