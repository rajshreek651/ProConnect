// All Business Logic is here, and in UI we need to just render it properly through UI

import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPosts } from "../../action/postAction/index.js";

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
};

const postSlice = createSlice({
    name: "post",

    initialState,

    reducers: {
        reset: () => initialState,

        resetPostId: (state) => {
            state.postId = ""
        },
        
    },

    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
            state.message = "Fetching all posts..."
        })

        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.postFetched = true;

            // console.log("PAYLOAD:", action.payload);
            // console.log("POSTS:", action.payload?.posts);

            state.posts = [...action.payload].reverse();

            // console.log("HERE, posts in reverse (latest) order ", state.posts);
        })

        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload // whatever message comes from backed will be used here
        })

        // For comments

        .addCase(getAllComments.fulfilled, (state, action) => {
            state.postId = action.payload.post_id;
            state.comments = action.payload.comments;
            // console.log(state.comments)
        })

    }
});

// =========================
// EXPORT ACTIONS
// =========================
export const { resetPostId } = postSlice.actions;

// =========================
// EXPORT REDUCER
// =========================
export default postSlice.reducer;