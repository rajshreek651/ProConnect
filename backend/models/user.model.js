import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String, 
        required: true
    }, 
    profilePicture: {
        type: String, 
        default: 'https://res.cloudinary.com/dlcvngqqg/image/upload/v1791694234/default.png' // a new logged in user will have a 'default profile image'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;