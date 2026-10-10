// To manage 'POSTS posted by user' --> we use 'posts.routes.js'

import { Router } from "express";
import { activeCheck, createPost, getAllPosts, deletePost, commentOnPost, getAllCommentsOfPost, deleteCommentOfPost, increment_likes} from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();

// for profile_picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // 'uploads/' folder made by us that we can store in our storage by 'compressing the images' in order to consume 'less bandwidth', but for uploading 'videos or posts' which consumes high bandwidth we have to use other services !!!
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
// Similarly, we can make for video uploads, posts uploads, etc. using 'multer' and giving the 'desired destination name as per the service used'

const upload = multer({storage: storage,
                       fileFilter: (req, file, cb) => {
                            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                                cb(null, true);
                            } else {
                                cb(new Error("Only JPG and PNG images are allowed"));
                            }
                        }
});

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