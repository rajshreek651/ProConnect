// HERE WE WILL CREATE AN 'INSTANCE OF AXIOS'

import axios from "axios";

export const BASE_URL = "http://localhost:3000";

/// CONNECTING FRONTEND TO BACKEND THROUGH AXIOS (AXIOS IS A PROMISE BASED HTTP CLIENT FOR THE BROWSER AND NODE.JS)
const clientServer = axios.create({
    baseURL: BASE_URL, // we are storing the url in baseURL (so, 'baseURL' act as an 'instance') so that we can use 'baseURL' in the entire project, so that if anytime we want to change it, we just need to to change it here  
});

export default clientServer;