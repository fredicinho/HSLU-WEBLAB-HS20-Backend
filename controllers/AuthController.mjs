import express from "express";
import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import User from "../models/User.mjs";

let router = express.Router();
dotenv.config();
let accessTokenSecret = process.env.JSON_WEBTOKEN_SECRET;

router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        email: req.body.email,
        username: req.body.name,
        password: hashPassword,
        user_type_id: req.body.user_type_id
    });

    // Save User in the database
    user.save((err, registeredUser) => {
        if (err) {
            res.status(500).send("There was a problem creating an User: " + err.message);
        } else {
            // create payload then Generate an access token
            let payload = { id: registeredUser._id, user_type_id: req.body.user_type_id || 0 };
            const token = jwt.sign(payload, accessTokenSecret);
            res.status(200).send({ token })
        }
    })
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if (!validPass) return res.status(401).send("Email or Password is wrong");

                // Create and assign token
                let payload = { id: user._id, user_type_id: user.user_type_id };
                const token = jwt.sign(payload, accessTokenSecret);

                res.status(200).header("auth-token", token).send({ "token": token });
            }
            else {
                res.status(401).send('Invalid mobile')
            }

        }
    })
});

function verifyUserToken(req, res, next){
    let token = req.headers.authorization;
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");

    try {
        token = token.split(' ')[1] // Remove Bearer from string

        if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

        let verifiedUser = jwt.verify(token, accessTokenSecret);   // config.TOKEN_SECRET => 'secretKey'
        if (!verifiedUser) return res.status(401).send('Unauthorized request')

        req.user = verifiedUser; // user_id & user_type_id
        next();

    } catch (error) {
        res.status(400).send("Invalid Token");
    }

}

function isUser(req, res, next) {
    if (req.user.user_type_id === "user") {
        next();
    }
    return res.status(401).send("Unauthorized!");
}

function isAdmin(req, res, next) {
    if (req.user.user_type_id === "admin") {
        next();
    }
    return res.status(401).send("Unauthorized!");
}

export {isUser, isAdmin, verifyUserToken, router}
