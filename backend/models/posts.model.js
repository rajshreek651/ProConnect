import mongoose, {Schema} from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference is 'User Model'
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    media: { // 'path' where we had uploaded the media
        type: String, // using 'multer' here
        default: ''
    },
    active: { // Later we can use AIML to detect whether the post is malicious or not secure using --> 'nsfw' --> not safe for work; If detected as 'malicious' post then that post can be 'banned' (but not actually deleted from database, coz the user may ask that my post was not malicious, or how can you just delete my post like that, then we need to detect it the user is correct, and if he is correct then we have to make the post visible, by making the flag 'active: true') automatically by knowing the 'userId' and the flag 'active' becomes 'false'. BUT REMEMBER THAT THESE DETECTION METHODS 'NSFW' PUTS LOADS ON SERVER
        type: Boolean, // active: false, if the post is detected as malicious, make that post invisible
        default: true // active: false, post should be visible
    },
    fileType: { // we are maintaining 'fileType' to get to know which file has been uploaded by the user (e.g.: jpg, png, webp, svg, gif, mp3, mp4, etc.), coz browser may not detect the fileType
        type: String,
        default: ''
    }
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;