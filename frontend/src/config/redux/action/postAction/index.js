import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => { // '_' is the actually the place of the data we are passing to 'thunkAPI'; but here we do not have any data in the url 'post/getAllPosts', so we pass a '_'; even if we don't pass anything will also do .....
        try{
            const response = await clientServer.get('/posts');
            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData, thunkAPI) => {
        const {file, body} = userData; // we are fetching 'file' and 'body' of user's entered data

        try{

            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            formData.append('media', file)

            const response = await clientServer.post('/post', formData, {
                // It's imp. to give headers here, to inform it to 'MULTER', that its not normal data, its 'multipart/form-data'... 
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post Uploaded");
            }else{
                return thunkAPI.fulfillWithValue("Unable to upload Post !!!");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async ({ post_id }, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete_post", {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);

export const incrementLike = createAsyncThunk(
    "post/incrementLike",
    async(post, thunkAPI) => {
        try {
            const response = await clientServer.post(`/increment_post_likes`, {
                post_id: post.post_id
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);

// Comments section
export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async(postData, thunkAPI) => {
        try{

            if (!postData?.post_id) {
                return thunkAPI.rejectWithValue({
                    message: "Post ID is missing"
                });
            }

            const response = await clientServer.get("/get_comments", {
                params: {
                    post_id: postData.post_id
                }
            });
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postData.post_id
            })
        }catch(err){
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try{
            console.log({
                post_id: commentData.post_id,
                body: commentData.body
            })
            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"), // getting the "token" of the user who has currently logged in and is going to 'comment'
                post_id: commentData.post_id, // the post_id of the post on which the user is going to 'comment'
                commentBody: commentData.body // the comment posted by the user
            });
            return thunkAPI.fulfillWithValue(response.data)
        }catch(err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);

export const deleteComment = createAsyncThunk(
    "post/deleteComment",
    async ({ comment_id }, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete_comment", {
                data: {
                    token: localStorage.getItem("token"),
                    comment_id: comment_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);