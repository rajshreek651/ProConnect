# PROCONNECT - A SOCIAL MEDIA PLATFORM 
##### Implemented with LinkedIn Styles


### Technologies Used
1. 'VS CODE' as IDE (Integrated Development Enironment)
2. 'NODE_JS' as JS Runtime Environment
3. 'EXPRESS' framework to handle backend
4. 'MONGO_DB' as DB storage
5. 'NEXT_JS' (made over REACT_JS) for frontend
6. 'CLOUDINARY' for Cloud storage for image files (jpg, jpeg, png)

***

## Features Implemented
- User authentication
- Profile management
- Connection requests
- Accept or Decline a connection request
- Comment on posts
- Upload a post
- Delete a post or comment as an AUTHORIZED USER
- See posts done by other users
- Discover people
- Download resume feature --> It is an instantaneous Resume creator
- RESPONSIVENESS added according to Laptop and Mobile view
- Instead of using the storing the files locally in '/uploads' folder, we used 'CLOUDINARY' as cloud storage platform

***

## Future Scope of project
1. A search bar can be added to search for people (web crawler functionalities)
2. Added the loading check after all your functions and just before 'return()'
3. AI implementation

***

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

***

## Challenges occurred while project development
1. 'get_user_and_profile' route not working sometimes : It is because when when user is deleted from the database by making direct changes in the DB or by some other changes, then it creates problem, coz the local storage has token, but the user of that token is now not found in DB. So for such cases 'REMOVE TOKEN FROM LOCAL STORAGE'. --> SOLVED
2. When switching between signup and login, clearing up the message generated 'e.g. user does not exits, user registered successfully' --> SOLVED
3. update the 'profile' & 'profileBackrop bg' as per users --> SOLVED
4. Delete icon to be shown only to authorized users --> SOLVED
5. Whoever has posted the post their icon should appear insted of the icon of logged-in user --> SOLVED
6. Add 'EDIT' button in backDrop image --> SOLVED
7. Connection Requests problem --> SOLVED
8. Making the pages responsive --> SOLVED
9. Update pictures links : since now the images or posts are uploaded on CLOUDINARY, so remove ${BASE_URL} syntax, and just 
    keep CLOUDINARY LINK as stored in DATABASE --> SOLVED 
10. Upload 'default images' of 'user and backdrop' in cloudinary, then copy the links for those default pictures in cloudinary, then in 
    'backend/models/profile.model.js', update with the cloudinary link; and similarly update in 'backend/models/user.model.js' --> SOLVED
11. Download resume problem --> SOLVED
12. Remove all the console thing like 'token', user ARRAY, etc. appearing, done during development of project

## When changes done in Profile model to add ProfileBackdrop picture
1. backed/models/profile.model.js : add section of 'profileBackdrop'
2. backend/user.controller.js : add func. for 'profileBackdropUpload'
3. backend/user.routes.js : Add route to update 'profile_backdrop'
4. frontend/src/pages/profile/index.jsx: (i) Add function to handleUploadBackdrop picture; (ii) Make changes in code to display them
