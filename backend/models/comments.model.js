// It will be connected by using 'userId' and 'postId'

import mongoose, {Schema} from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: { // whoever made it
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference is 'User Model'
    },
    postId: { // In which post it is to be shown 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // reference is 'Post Model'
    },
    body: {
        type: String,
        required: true
    }
});

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;