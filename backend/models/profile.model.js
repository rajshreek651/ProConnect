// This will contasin many schema like EducationSchema, etc., ....  same as when we log in we are shown in linked in, in the Profile page

import mongoose, {Schema} from "mongoose";

const EducationSchema = new mongoose.Schema({
    school: {
        type: String,
        default: '',
    },
    degree: {
        type: String,
        default: '',
    },
    fieldOfStudy: {
        type: String,
        default: '',
    },
});

const WorkSchema = new mongoose.Schema({
    company: {
        type: String,
        default: '',
    },
    position: {
        type: String,
        default: '',
    },
    years: {
        type: String,
        default: '',
    },
});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference is 'User Model'
    },
    backdropPicture: {
        type: String,
        default: 'https://res.cloudinary.com/dlcvngqqg/image/upload/v1791693589/default-background-image.png',
    },
    bio: {
        type: String,
        default: '',
    },
    currentPost: {
        type: String,
        default: '',
    },
    pastWork: {
        type: [WorkSchema],
        default: [],
    },
    education: {
        type: [EducationSchema],
        default: [],
    },
});

const ProfileModel = mongoose.model("Profile", ProfileSchema);

export default ProfileModel;
