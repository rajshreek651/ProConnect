// 'posts.controller.js' will have all those routes, which are related to 'POST' requests
// EXPORT funcs. from here to ../routes/post.routes.js'

import UserModel from "../models/user.model.js";
import PostModel from "../models/posts.model.js";
import ProfileModel from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import CommentModel from "../models/comments.model.js";


export const activeCheck = async (req, res) => { // to check if apis are working properly, if not working properly, it indicates that 'its not working'
    return res.status(200).json({message: "RUNNING PERFECTLY ."});
} // import this in ./routes/posts.routes.js'

// CREATE POST
export const createPost = async (req, res) => {
    const {token} = req.body;

    try{

        const user = await UserModel.findOne({token: token});
        if(!user) {
            return res.status(404).json({message: "User does not exist !!"});
        } 

        const post = new PostModel({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "", // means if a user had not posted anything yet, then instead of 'undefined' we can replace it by 'an empty string' 
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "" // 'req.file.mimetype.split("/")[1]' --> converts 'req.file.mimetype' to list of strings where original string separated by "/" --> and we get actually the fileType at index[1] of the list as done by split
        });
        await post.save();
        return res.status(200).json({message: "Post Created"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

// Get All Posts as posted by logged in users
// NO AUTHENTICATION CHECK REQUIRED --> anybody can access this, be it 'logged in user' or not
export const getAllPosts = async (req, res) => { 
    try{

        const posts = await PostModel.find().populate('userId', 'name username email profilePicture');
        return res.json(posts);

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

// DELETE POST
export const deletePost = async(req, res) => {
    const {token, post_id} = req.body;
    // Here, we need 'TOKEN' for 'AUTHORIZATION' to check if the person deleting the post is the same person who posted it.
    // For FRONTEND purpose we may not show the 'DELETE POST' button to the 'UNAUTHORIZED USER', 
    // BUT, one may use 'Developer Tools like HOPPSCOTCH' to access our post and sent a '/delete_post' POST request, then it can be deleted by anyone (even by UNAUTORIZED USER)
    // So, we need 'TOKEN' to 'DENY UNAUTHORIZED ACCESS'

    try{

        // GETTING THE USER
        const user = await UserModel.findOne({token: token}).select("_id") ; // get getting the 'userId'
        if(!user) {
            return res.status(404).json({message: "User does not exist !!"});
        } 

        // GETTING THE POST
        const post = await PostModel.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({message: "Post not found !!"});
        } 

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "You are an Unauthorized user to delete this post !!"});
        }

        // ELSE AUTHORIZED USER CAN DELETE THAT POST
        await PostModel.deleteOne({_id: post_id}); // or if we don't want the post to actually get deleted from the DB then we can make 'active: false', and make the functionality in frontend such a way that the posts in which 'active: false' should not be displayed or made accessible
        return res.json({message: "Post Deleted"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

// COMMENT ON POST
export const commentOnPost = async (req, res) => {

    const {token, post_id, commentBody} = req.body;

    try{

        const user = await UserModel.findOne({token: token}).select("_id"); // we use ' select("_id") '
        if(!user) {
            return res.status(404).json({message: "User does not exist !!"});
        }

        const post = await PostModel.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({message: "Post not found !!"});
        } 

        const comment = new CommentModel({
            userId: user, // coz we selected '.select("_id")'
            postId: post_id,
            body: commentBody
        });

        await comment.save();
        return res.status(200).json({message: "Comment Added"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

// GET ALL THE COMMENTS BELONGING TO A PARTICULAR POST
export const getAllCommentsOfPost = async (req, res) => {
    const {post_id} = req.query; // Here, we do not need 'TOKEN', coz any 'anonymous user' can also see the comments

    try{

        const post = await PostModel.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({message: "Post not found !!"});
        } 

        const comments = await CommentModel
        .find({postId: post_id})
        .populate("userId", "username name profilePicture");

        return res.json(comments.reverse()); // comments gives the ARRAY OF COMMENTS

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

// DELETE COMMENT (TO BE DONE BY AUTHORIZED USER ONLY)
export const deleteCommentOfPost = async (req, res) => {
    const {token, comment_id} = req.body; // Here, we do  need 'TOKEN', coz it should be done only by the AUTHORIZED USER ONLY
    try{

        const user = await UserModel.findOne({token: token}).select("_id") ; // get getting the 'userId'
        if(!user) {
            return res.status(404).json({message: "User does not exist !!"});
        }

        const comment = await CommentModel.findOne({_id: comment_id});
        if(!comment) {
            return res.status(404).json({message: "Comment not found !!"});
        } 

        // Else if comment is found, then check if the user is AUTHORIZED OR NOT
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "You are an Unauthorized user to delete this comment !!"});
        }

        // Else if AUTHORIZED USER, then delete it
        await CommentModel.deleteOne({_id: comment_id});
        return res.status(200).json({message: "Comment deleted"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};


// INCREMENT LIKES
export const increment_likes = async (req, res) => {
    const {post_id} = req.body; // Here, we do  need 'TOKEN', coz it should be done only by the AUTHORIZED USER ONLY
    try{

        const post = await PostModel.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({message: "Post not found !!"});
        } 

        // Else increase likes
        post.likes = post.likes + 1;

        await post.save();
        return res.status(200).json({message: "Likes incremented"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

