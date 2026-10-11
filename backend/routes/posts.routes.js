// To manage 'POSTS posted by user' --> we use 'posts.routes.js'

import { Router } from "express";
import { activeCheck, createPost, getAllPosts, deletePost, commentOnPost, getAllCommentsOfPost, deleteCommentOfPost, increment_likes} from "../controllers/posts.controller.js";
import upload from "../middleware/multer.js";


const router = Router();

router.route('/').get(activeCheck);

// CREATE POST
router.route("/post").post(upload.single('media'), createPost);

// GET ALL POSTS OF All USERS WHO HAD POSTED
router.route("/posts").get(getAllPosts);
// Search the url:- http://localhost:3000/posts --> anybody can access this, be it 'logged in user' or not

// DELETE POST
router.route("/delete_post").delete(deletePost);

// COMMENT
router.route("/comment").post(commentOnPost);

// GET ALL THE COMMENTS BELONGING TO A PARTICULAR POST
router.route("/get_comments").get(getAllCommentsOfPost);

// DELETE COMMENT (TO BE DONE BY AUTHORIZED USER ONLY)
router.route("/delete_comment").delete(deleteCommentOfPost);

// INCREMENT LIKES
router.route("/increment_post_likes").post(increment_likes);

export default router; // import this to ./server.js'