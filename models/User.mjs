import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * User Roles:
 * - Admin: admin
 * - Blogger: user
 * -
 *
 */

const userSchema = new Schema({
    email: String,
    password: String,
    username:String,
    user_role: String,
});

export default mongoose.model('user', userSchema, 'users');
