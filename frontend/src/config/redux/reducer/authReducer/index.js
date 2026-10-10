// All Business Logic is here, and in UI we need to just render it properly through UI

import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionRequestsByMe, getConnectionRequestsToMe, getMyNetwork, loginUser, registerUser } from "../../action/authAction/index.js";

const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    myNetwork: [],
    all_users: [],
    all_profiles_fetched: false
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        reset: () => initialState,

        handleLoginUser: (state) => {
            state.message = "hello";
        },

        emptyMessage: (state) => {
            state.message = "";
        },

        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },

        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => {
        builder

        // =========================
        // LOGIN
        // =========================

        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.message = "Knocking the door..."
        })

        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Log in successful"
        })

        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.loggedIn = false;

            state.message =
                action.payload?.message || "Login failed"
        })

        // =========================
        // REGISTER
        // =========================

        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.message = "Registering you..."
        })

        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;

            // User is NOT logged in yet
            state.loggedIn = false;

            state.message = "Registration successful, Please log in to continue."
        })

        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.loggedIn = false;

            state.message =
                action.payload?.message || "Registration failed"
        })

        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload
        })

        // =================
        // DISCOVER PAGE
        // =================

        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload.profiles
        })

        // ==============================
        // HANDLING CONNECTION REQUESTS
        // ==============================

        // getConnectionRequestsByMe successfully sent by my side
        .addCase(getConnectionRequestsByMe.fulfilled, (state, action) => {
            state.connections = action.payload;
        })

        // getConnectionRequestsByMe not sent due to server or network problem
        .addCase(getConnectionRequestsByMe.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload || "Failed to fetch connections";

            /* IMPORTANT: Don't put the error message inside connections */
            state.connections = [];
        })

        // getConnectionRequestsToMe successfully reaching my end
        .addCase(getConnectionRequestsToMe.fulfilled, (state, action) => {
            state.connectionRequest = action.payload
            // console.log(`From authReducer ${state.connectionRequest}`)
        })

        // getConnectionRequestsToMe not reaching my end due to server or network problem
        .addCase(getConnectionRequestsToMe.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload || "Failed to fetch connection requests";

            state.connections = [];
        })

        // getMyNetwork successfully reaching my end
        .addCase(getMyNetwork.fulfilled, (state, action) => {
            state.myNetwork = action.payload;
        })

        // getMyNetwork not reaching my end due to server or network problem
        .addCase(getMyNetwork.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload || "Failed to fetch my network";

            state.myNetwork = [];
        })
    }
});

// =========================
// EXPORT ACTIONS
// =========================
export const { reset, handleLoginUser, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;

// =========================
// EXPORT REDUCER
// =========================
export default authSlice.reducer;