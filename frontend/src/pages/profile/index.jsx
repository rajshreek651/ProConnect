import { getAboutUser } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import clientServer, { BASE_URL } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function ProfilePage() {

    const authState = useSelector((state) => state.auth);

    const postReducer = useSelector((state) => state.posts);

    const [userProfile, setUserProfile] = useState(null)

    const [userPosts, setUserPosts] = useState([])

    // Work list window is here referred to as 'Modal'
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Education list window is here referred to as 'Modal'
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);

    const dispatch = useDispatch();

    /* Can be done this way if less no. of I/Ps */
    // const [companyName, setCompanyName] = useState("");
    // const [positionName, setPositionName] = useState("");
    // const [years, setYearsName] = useState("");

    // But if we need to handle more no. of I/Ps, then
    const [workInputData, setWorkInputData] = useState({
        company: '',
        position: '',
        years: ''
    }); // '{company: '', position: '', years: ''}' --> in backend we are accepting in this format only , so we used 'object format'

    const handleWorkInputChange = (e) => {
        const {name, value} = e.target;
        setWorkInputData({...workInputData, [name]: value });
    }

    const [educationInputData, setEducationInputData] = useState({
        school: '',
        degree: '',
        fieldOfStudy: ''
    });

    const handleEduCationInputChange = (e) => {
        const {name, value} = e.target;
        setEducationInputData({...educationInputData, [name]: value });
    }

    useEffect(() => {
        dispatch(getAboutUser({
            token: localStorage.getItem("token")
        }))
        dispatch(getAllPosts())
    }, [])

    // means jab jab profile change hoga by then the EVENT 'authState.user' update hoga and profile UPDATE hoga by 'setUserProfile(authState.user)'
    useEffect(() => {
        if(authState.user){ // if we get the 'authState.user' then only ... set 'PROFILE' & 'POST'
            setUserProfile(authState.user)
            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            })
            // console.log(post)
            setUserPosts(post);
        }
    }, [authState.user, postReducer.posts])

    // Update Profile Picture
    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));
        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {

                'Content-Type' : 'multipart/form-data',

            },
        });

        // getting the updated profile, we will have to again dispatch 'getAboutUser()', to make changes appear
        dispatch(getAboutUser({
            token: localStorage.getItem("token")
        }));
    };


    // Update Backdrop Picture
    const updateBackDropPicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_backdrop", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_backdrop", formData, {
            headers: {
                'Content-Type' : 'multipart/form-data',
            },
        });

        // getting the updated profile, we will have to again dispatch 'getAboutUser()', to make changes appear
        dispatch(getAboutUser({
            token: localStorage.getItem("token")
        }));
    };

    // Update Profile Data
    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
            email: userProfile.userId.email
        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        // After Updating again DISPATCH to show the updated changes
        dispatch(getAboutUser({
            token: localStorage.getItem("token")
        }));

        //  'getAboutUser' will trigger the EVENT 'authState.user' and useEffects 'setUserProfile(authState.user)' will make changes and updated; the will check 'userProfile != authState.user' --> will turn FALSE & 'Update Profile' button disappears
    }

    return (

        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile?.userId &&
                    <div className={styles.container}>

                        {/* ================= BACKDROP ================= */}
                        <div className={styles.backDropContainer}
                            style={{backgroundImage: `url(${userProfile.backdropPicture})`}}>

                            <label htmlFor="profileBackdropUpload"
                                className={styles.backDrop_edit_label}>
                                <p>Edit</p>
                            </label>

                            <input onChange={(e) => {updateBackDropPicture(e.target.files[0])}}
                                hidden
                                type="file"
                                id="profileBackdropUpload"
                            />
                        </div>


                        {/* ================= PROFILE ================= */}
                        <div className={styles.profileContainer}>
                            <img src={userProfile.userId.profilePicture} alt="profile" />

                            <label htmlFor="profilePictureUpload" className={styles.profile_edit_label}>
                                <p>Edit</p>
                            </label>

                            <input onChange={(e) => {updateProfilePicture(e.target.files[0])}}
                                hidden
                                type="file"
                                id="profilePictureUpload"
                            />
                        </div>

                        {/* Other Profile details like name, username, bio, etc. */}
                        <div className={styles.profileContainer_details}>
                            <div style={{display: "flex", flexDirection:"column", gap: "0.7rem"}}>

                                <div style={{flex: "0.8"}}>
                                    <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>

                                        <input className={styles.nameEdit} type="text" value={userProfile.userId.name}
                                            onChange={(e) => {setUserProfile({
                                                    ...userProfile,
                                                    userId: {...userProfile.userId, name: e.target.value}
                                                })
                                            }}
                                        />

                                        <p style={{color: "grey"}}>@{userProfile.userId.username}</p>
                                    </div>
                                </div>


                                <div style={{display: "flex", alignItems: "center", gap: "1.2rem"}}>
                                
                                    {/* DOWNLOAD RESUME BUTTON */}
                                    <div
                                        onClick={async () => {
                                            try {
                                                console.log("STEP 1: Starting resume download...");
                    
                                                const response = await clientServer.get(
                                                    `/user/download_resume?id=${userProfile.userId._id}`,
                                                    {
                                                        responseType: "blob"
                                                    }
                                                );
                    
                                                console.log("STEP 2: PDF received from backend");
                                                console.log("PDF size:", response.data.size, "bytes");
                    
                                                // Create a downloadable PDF blob
                                                const pdfBlob = new Blob([response.data], {
                                                    type: "application/pdf"
                                                });
                    
                                                console.log("STEP 3: Creating download URL...");
                    
                                                const pdfUrl = window.URL.createObjectURL(pdfBlob);
                    
                                                // Create a temporary anchor element
                                                const link = document.createElement("a");
                    
                                                link.href = pdfUrl;
                                                link.download = `${userProfile.userId.username}-resume.pdf`;
                    
                                                document.body.appendChild(link);
                    
                                                console.log("STEP 4: Downloading resume...");
                    
                                                link.click();
                    
                                                // Clean up
                                                link.remove();
                                                window.URL.revokeObjectURL(pdfUrl);
                    
                                                console.log("STEP 5: Resume download initiated successfully");
                    
                                            } catch (error) {
                                                console.error(
                                                    "RESUME DOWNLOAD FAILED:",
                                                    error.response?.data || error.message
                                                );
                    
                                                alert("Failed to download resume. Please try again.");
                                            }
                                        }}
                                        style={{ cursor: "pointer" }}
                                        title="Download Resume"
                                    >
                                        <svg
                                            style={{ height: "1.2em" }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                            />
                                        </svg>
                                        &nbsp;&nbsp;<b><i>Download Resume</i></b>
                                    </div>
                
                                    
                                </div>


                                {/* User Profile */}
                                <div>
                                    <textarea value={userProfile.bio} onChange={(e) => {
                                            setUserProfile({...userProfile, bio: e.target.value})
                                        }}
                                        rows={Math.max(3, Math.ceil((userProfile.bio || "").length / 80)
                                        )} // Adjust as needed

                                        style={{width: "100%"}}
                                    />
                                </div>
                            </div>

                            <div style={{flex: "0.2"}}>
                                <h3 style={{marginBlock: "1rem"}}>Recent Activity</h3>

                                {// will show the posts which were 'filtered' above
                                    userPosts.map((post) => {
                                        return(
                                            <div key={post._id} className={styles.postCard}>
                                                <div className={styles.card}>
                                                    <div className={styles.card_profileContainer}>
                                                        {post.media !== "" ?
                                                            <img src={post.media} alt="post_media" />
                                                            :
                                                            <div style={{ width: "3.4rem", height: "3.4rem"}}></div>
                                                        }
                                                    </div>

                                                    <p>{post.body}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* DISPLAYING WORK HISTORY */}
                        <div className={styles.workHistory}>
                            <h4>Work History</h4>

                            <div className={styles.workHistoryContainer}>
                                {(userProfile.pastWork || []).map((work, index) => {
                                        return (
                                            <div key={index} className={styles.workHistoryCard}>

                                                <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>
                                                    {work.company} - {work.position}
                                                </p>

                                                <p>{work.years}</p>

                                            </div>
                                        )
                                    })
                                }

                                <button className={styles.addWorkButton} onClick={() => {setIsModalOpen(true)}}>
                                    Add Work
                                </button>

                            </div>
                        </div>

                        {/* DISPLAYING EDUCATION HISTORY */}
                        <div className={styles.workHistory}>
                            <h4>Education History</h4>
                            <div className={styles.workHistoryContainer}>

                                {(userProfile.education || []).map((edu, index) => {
                                        return (
                                            <div key={index} className={styles.workHistoryCard}>

                                                <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>
                                                    {edu.school} - {edu.degree}
                                                </p>

                                                <p>{edu.fieldOfStudy}</p>
                                            </div>
                                        )
                                    })
                                }

                                <button className={styles.addWorkButton} onClick={() => {setIsEduModalOpen(true)}}>
                                    Add Education History
                                </button>

                            </div>
                        </div>

                        {/* If USER PROFILE IS UPDATED (i.e. 'current-info' not matching with the previous one) THEN WE WILL SHOW THE UPDATE BUTTON to make changes */
                        userProfile != authState.user &&
                            <div onClick={() => {updateProfileData()}} className={styles.updateProfileBtn}>
                                Update Profile
                            </div>
                        }

                        {/* Displaying Work History Modal Window */
                        isModalOpen &&
                            <div onClick={() => {setIsModalOpen(false)}} className={styles.commentsContainer}>
                                <div onClick={(e) => {e.stopPropagation()}} className={styles.allCommentsContainer}>

                                    <input
                                        onChange={handleWorkInputChange}
                                        name='company'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter Company"
                                    />

                                    <input
                                        onChange={handleWorkInputChange}
                                        name='position'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter Position"
                                    />

                                    <input
                                        onChange={handleWorkInputChange}
                                        name='years'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter No. of Years worked"
                                    />

                                    <div onClick={() => {setUserProfile({
                                                ...userProfile,
                                                pastWork: [...userProfile.pastWork, workInputData]
                                            })
                                            setIsModalOpen(false)
                                        }}
                                        className={styles.updateProfileBtn}>Add Work</div>
                                </div>
                            </div>
                        }

                        {/* Displaying Education History Modal Window */
                        isEduModalOpen &&
                            <div onClick={() => {setIsEduModalOpen(false)}} className={styles.commentsContainer}>
                                <div onClick={(e) => {e.stopPropagation()}} className={styles.allCommentsContainer}>
                                    <input onChange={handleEduCationInputChange}
                                        name='school'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter School Name"
                                    />

                                    <input onChange={handleEduCationInputChange}
                                        name='degree'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter Degree"
                                    />

                                    <input
                                        onChange={handleEduCationInputChange}
                                        name='fieldOfStudy'
                                        className={styles.inputField}
                                        type="text"
                                        placeholder="Enter Field Of Study"
                                    />

                                    <div onClick={() => {
                                        setUserProfile({...userProfile,
                                            education: [...userProfile.education, educationInputData]
                                        })

                                            setIsEduModalOpen(false)

                                        }} className={styles.updateProfileBtn}>Add Education Details</div>
                                </div>
                            </div>
                        }
                    </div>
                }

            </DashboardLayout>
        </UserLayout>
    )
}