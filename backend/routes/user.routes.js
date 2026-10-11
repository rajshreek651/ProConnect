// To manage 'USER POST REQUESTS' --> we use 'user.routes.js'

import { Router } from "express";
import { register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionsRequests, connectionsSentToMe, acceptConnectionRequest, getMyNetwork, getUserProfileAndUserBasedOnUsername, uploadProfileBackdrop} from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

// Route to update profile_picture
router.route('/update_profile_picture')
    .post(upload.single('profile_picture'), uploadProfilePicture); // 'uploadProfilePicture' is from '../controllers/user.controller.js'
// 'profile_picture' --> this name is used in 'frontend' (like if sending through hoppscotch field, enter this name) when we send the 'form-data' to backend, so we have to use the same name here in 'upload.single()' function

// Route to update profile_backdrop
router.route('/update_profile_backdrop')
    .post(upload.single('profile_backdrop'), uploadProfileBackdrop);
// 'profile_backdrop' --> this name is used in 'frontend' (like if sending through hoppscotch field, enter this name) when we send the 'form-data' to backend, so we have to use the same name here in 'upload.single()' function

// Authentication routes
router.route('/register').post(register);
router.route('/login').post(login);

// Route to update user username, email, etc...
router.route("/user_update").post(updateUserProfile);
// This above router will just update 'email' & 'username'
// For rest things(like, education, add_work, experiences, etc...) to update we will make another route
// For this we first need to check, what the user is providing (Is it 'education' or 'add_work' or 'experiences')
router.route("/get_user_and_profile").get(getUserAndProfile);
// then we can update the profile
router.route("/update_profile_data").post(updateProfileData)
// to get all users profile with the matching name as searched
router.route("/user/get_all_users").get(getAllUserProfile);

// to download linkedin profile as resume pdf
router.route("/user/download_resume").get(downloadProfile); 
// While testing, Search as--> http://localhost:3000/user/download_resume?id=6a92808769bec9a1e44be5e1
// The above 'search' will download the pdf in 'uploads' folder, the copy the pdf name and search
// then can search the pdf as e.g. -->http://localhost:3000/2d23dcc0084d5a2e72f46273831257780da8b94b9b470e7077df8e43fc6a6987.pdf

// send connection request to other members in linkedin
router.route("/user/send_connection_request").post(sendConnectionRequest);

// get all connections 'requests' sent BY me
router.route("/user/get_ConnectionRequests_sent_by_me").get(getMyConnectionsRequests);

// get all Connections Requests sent TO me
router.route("/user/get_ConnectionsRequests_sent_to_me").get(connectionsSentToMe);

// Connection Accepted or Rejected
router.route("/user/accept_connection_request").post(acceptConnectionRequest);

// Get list of people CONNECTED to me
router.route("/user/get_my_network").get(getMyNetwork);

// Getting user and their profile based on 'USERNAME'
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);

export default router; // import this to './server.js'