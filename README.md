
1. Education History update function --> Not visible --> SOLVED

2. 'user_update' route not happening --> SOLVED

3. 'get_user_and_profile' not working sometimes 

4. update the profileBackrop bg as per users --> SOLVED

5. Remove all the console thing like 'token', user ARRAY, etc. appearing, done during development of project --> SOLVED

6. Remove extra things like 'unused extra styles in css files, index, favicon, next.js already code etc.' --> SOLVED

7. Correct identation and spacing formats --> SOLVED

8. Ask GPT: Do i need to upload '/uploads' folder also in github .... the generated pdfs --> One should not upload '/uploads' in github

**9. USE CLOUDINARY

**9. DEPLOYMENT ON RENDER
**9. Do not add middleware in github
**9. update .env
**9. update .gitignore

10. Make landing page responsive --> SOLVED

11. Connection Requests problem --> SOLVED

12. Delete icon to be shown only to authorized users --> SOLVED

13. Whoever has posted the post their icon should appear insted of the icon of logged-in user --> SOLVED

14. if i did post from 'api.http' from one account then everybody recent work history got updated even if they didn't posted it.
--> RECENT WORK PROBLEM --> SOLVED



# PROCONNECT - A SOCIAL MEDIA PLATFORM 
##### Implemented with LinkedIn Styles


## Project Workflow during Project Development Phase

#### Backend
1. Setting up the project: package.json, installing npm dependencies
2. Creating Models for Mongoose
3. Authentication: Register, Login, & Setting up the routes
4. Testing with 'api.http'
5. Setting up 'MULTER' & Updating Profile Picture
6. Updating & Getting User Profile
7. Exploring PDF 'Download Profile'
8. 'Connection Request' Functionality
9. Using 'MULTER' to implement "Post the user's posts"
10. 'Delete' & 'Flag' Concept to hide the post or comment for 'Delete Request'
11. Implementing CRUD Functionality

#### Frontend
12. Starting with Frontend, Redux
13. Setting up Config for API Connection
14. Setting up Redux & Authentication
15. Designing Home / Landing Page
16. Understanding the Styling System
17. Implementing Landing Page UI
18. Creating Authentication Page
19. Connecting 'Authentication Page' with 'Backend'
20. Creating the Dashboard - Posts Request
21. Connecting Dashboard Components to Backend
22. Pure CSS Techniques - Creating Dashboard
23. Styling UI for getting all Posts in Dashboard
22. Integrating with Backend
23. Creating the Post Feed Functionality
24. *********************** Fetching Posts from API  ****************************
25. Implementing User's Post options - Share Post Functionality
26. Comment on Post - UI
27. Implementing Comment 'GET REQUEST' & 'POST REQUEST'
28. Creating 'Discover users' Page
29. Navigating to a particular User Profile
30. Creating the User Profile Page
31. Creating the Connection Requests Page and Functionality
32. Implementing 'User Work History'
33. Creating Resume Download Function
34. Seeing My Connection Request
35. Creating 'My Profile Page' (logged-in user's Profile Page)
36. Profile Page Update Functionality
37. Adding the 'ADD WORK' Functionality
38. Deploying LinkedIn Clone "PROCONNECT" in 'Render'


## Project Features
1. It is an instantaneous Resume creator
2. Added the loading check after all your functions and just before 'return()'
3. RESPONSIVENESS added according to Laptop and Mobile view

## Can Be Done
1. Instead of using the storing the files locally in '/uploads' folder, we can use platforms like 'CLOUDINARY'
2. Add the loading check after all your functions and just before 'return()'

## Challenges occurred while project development


## When changes done in Profile model to add ProfileBackdrop picture

1. backed/models/profile.model.js : add section of 'profileBackdrop'
2. backend/user.controller.js : add func. for 'profileBackdropUpload'
3. backend/user.routes.js : Add route to update 'profile_backdrop'
4. frontend/src/pages/profile/index.jsx: (i) Add function to handleUploadBackdrop picture; (ii) Make changes in code to display them



######

https://meet.google.com/eek-cnux-cdy?hs=197&hs=187&authuser=0&ijlm=1791433959869&adhoc=1