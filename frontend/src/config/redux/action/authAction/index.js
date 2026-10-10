import {createAsyncThunk} from '@reduxjs/toolkit';
import clientServer from '../../../index.jsx'; // Importing the 'clientServer' instance from the 'clientServer.js' file in the 'axios' folder. This instance is used to make API calls to the backend server. The 'clientServer' instance is created using the 'axios.create()' method, which allows us to create a new instance of axios with a custom configuration. The custom configuration includes the base URL of the backend server, which is defined in the 'clientServer.js' file. By using this instance, we can make API calls to the backend server without having to specify the base URL every time we make a request.
import { connection } from 'next/server.js';

export const loginUser = createAsyncThunk(
  'user/login',
    async (user, thunkAPI) => { 
        try{

            const response = await clientServer.post(`/login`, { // name should be same as given in 'routes.js' in 'backend' folder
                email: user.email,
                password: user.password
                // If any error comes like 'email not found' or 'password is incorrect', it will be handled in the 'backend' folder in 'routes.js' file and will be sent to the frontend as a response. So, we can handle it here in the frontend.
            });

            // If the response is successful, we can return the response data to the 'fulfilled' state of the 'loginUser' action.
            if(response.data.token){
                localStorage.setItem('token', response.data.token); // Store the user data in localStorage
            }else{
                return thunkAPI.rejectWithValue({message: "token not provided"}); // If the response is not successful, we can return the response data to the 'rejected' state of the 'loginUser' action.
            }

            return thunkAPI.fulfillWithValue(response.data.token); // Return the response data to the 'fulfilled' state of the 'loginUser' action.

        }catch(err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: err.message }
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/register', {
                username: user.username,
                name: user.name,
                email: user.email,
                password: user.password
            });

            return response.data;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: err.message
                }
            );
        }
    }
);

// extracting user's info
export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.get("/get_user_and_profile", { 
                params: {
                    token: user.token // putting it inside 'params' , coz its a 'GET' request
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
           return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
        }
    }
);

/* ----------------------------------------------------------------------------------------------------------------------------------- */

// For 'Discover Page'

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI) => {
        try{

            const response = await clientServer.get("/user/get_all_users")

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
        }
    }
);

/* Handling Connections */

// sendConnectionRequest to other users
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async(user, thunkAPI) => {
    try{
        const response = await clientServer.post("/user/send_connection_request", {
            token: user.token, // has user_id of 'logged-in' user
            connectionId: user.user_id // has 'user_id' of user to whom 'connection request' is being sent
        });

        // when connection request is sent, then it sould be listed in 'getConnectionRequestsByMe'... which will be handled in 'getConnectionRequestsByMe', then it will go to " authReducer's case of 'getConnectionRequestsByMe' "... where if fulfilled then it will show the 'Pending' state of the button.... ; and if the user's connection req is ACCEPTED then the button will show 'Connected'
        thunkAPI.dispatch(getConnectionRequestsByMe({token: user.token}))

        return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }  
);

// getConnectionRequest --> will show all those users who are our connection
export const getConnectionRequestsByMe = createAsyncThunk(
    "user/getConnectionRequestsByMe",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/get_ConnectionRequests_sent_by_me", {
                params: { token: user.token }
            });

            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const getConnectionRequestsToMe = createAsyncThunk(
    "user/getConnectionRequestsToMe",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/get_ConnectionsRequests_sent_to_me", {
                params:{ token: user.token}
            });

            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

// getMyNetwork --> will show all users who are connected with me
export const getMyNetwork = createAsyncThunk(
    "user/getMyNetwork",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/get_my_network", {
                params: {
                    token: user.token
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action // whether accepted(true) or rejected(false)
            });

            // to reload the changes made
            thunkAPI.dispatch(getConnectionRequestsByMe({token: user.token}))
            thunkAPI.dispatch(getConnectionRequestsToMe({token: user.token}))
            thunkAPI.dispatch(getMyNetwork({token: user.token}))
            
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);
