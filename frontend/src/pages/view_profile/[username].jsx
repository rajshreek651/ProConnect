import clientServer, { BASE_URL } from '@/config';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequestsByMe, getConnectionRequestsToMe, sendConnectionRequest, acceptConnection } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) { // this 'userProfile' is coming from 'props' sent from down below in 'Server-side rendering'

  const searchParameters = useSearchParams();
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  // to check if the currently-viewed user is in our(logged-in user's) 'connection' or not... if not then we can show 'send request' button in the profile page of that viewed user
  const [isCurrentUserInConnnection, setIsCurrentUserInConnnection] = useState(false);

  // to check if 'connection req' ACCEPTED or not
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  // Logged-in user's ID
  const currentUserId = authState.user?.userId?._id;

  // Profile being viewed
  const profileUserId = userProfile.userId._id;

  const sentRequest = authState.connections?.find(
      (connection) => connection.connectionId?._id === profileUserId
  );

  const receivedRequest = authState.connectionRequest?.find(
      (connection) => connection.userId?._id === profileUserId
  );

  const getUsersPost = async () => {
    await dispatch(getAllPosts()); // to show in my 'RECENT ACTIVITIES'
    await dispatch(getConnectionRequestsByMe({token: localStorage.getItem("token")})); // TO SHOW THE 'CONNECTION BUTTON' 's Status
    await dispatch(getConnectionRequestsToMe({token: localStorage.getItem("token")}));
  };

  // showing posts
  useEffect(() => {
    // 'filter' is used to get the posts done by user whose profile is being viewed
    let post = postReducer.posts.filter((post) => {
      // If the profile(here, recognized by 'username') of user who had posted is SAME as the the 'username' we clicked to view ...
      return post.userId.username === router.query.username
    })
    // .... then display all the posts done by that user, (coz we are viewing their profile page)
    setUserPosts(post);
  }, [postReducer.posts])

  // show connections
  useEffect(() => {
      // console.log("connections:", authState.connections);
      // console.log("isArray:", Array.isArray(authState.connections));
      // console.log("userId:", userProfile.userId._id);

      // Reset these values first
      setIsCurrentUserInConnnection(false);
      setIsConnectionNull(true);

      // means if the 'user being viewed' is in connection to the 'logged-in user',
      // then 'setIsCurrentUserInConnnection(true)'

      // Check connections which were sent by me
      const sentConnection = authState.connections?.find(
        user => user.connectionId?._id === profileUserId
      );

      // Check connection requests which were received by me
      const receivedConnection = authState.connectionRequest?.find(
        user => user.userId?._id === profileUserId
      );

      // Check if the request sent by me has been ACCEPTED
      if(sentConnection?.status_accepted === true){
        // The user is now connected
        setIsCurrentUserInConnnection(true);

        setIsConnectionNull(false);
      }

      // Check if the request received by me has been ACCEPTED
      else if(receivedConnection?.status_accepted === true){
        // The user is now connected
        setIsCurrentUserInConnnection(true);

        setIsConnectionNull(false);
      }
  }, [authState.connections, authState.connectionRequest, profileUserId]);
  

  useEffect(() => {
    getUsersPost();
  }, []);


  return (
    <UserLayout>
      <DashboardLayout>
        {/* <div>{userProfile.userId.name}</div> .... 'userProfile' is the 'prop' passed to 'ViewProfilePage({userProfile})' */}

        <div className={styles.container}>
          <div className={styles.backDropContainer} style={{backgroundImage: `url(${BASE_URL}/${userProfile.backdropPicture})`}}>
            <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profile" />
          </div>

          <div className={styles.profileContainer_details}>
            <div style={{display: "flex", flexDirection:"column", gap: "0.7rem"}}>

              <div style={{flex: "0.8"}}>
                  <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
                    <h2>{userProfile.userId.name}</h2>
                    <p style={{color: "grey"}}>@{userProfile.userId.username}</p>
                  </div>
              </div>
                
              <div style={{display: "flex", alignItems: "center", gap: "1.2rem"}}>

                {// HANDLING CONNECTIONS
                  !currentUserId ? (
                    // User is not logged in → don't show connection buttons
                    null
                  ) : currentUserId === profileUserId ? (
                    // Own profile → show No Button
                    null
                  ) : isCurrentUserInConnnection ? (
                    // Already connected --> 'CONNECTed BTN'
                    <button className={styles.connectedButton}>
                        Connected
                    </button>
                  ) : sentRequest?.status_accepted === null ? (
                    // YOU sent the request --> 'PENDING BTN'
                    <button className={styles.connectedButton}>
                        Pending
                    </button>
                  ) : receivedRequest?.status_accepted === null ? (
                    // THEY sent the request to YOU --> 'ACCEPT INVITE BTN'
                    <button className={styles.connectedButton} 
                      onClick={async (e) =>{
                        e.stopPropagation();

                        await dispatch(acceptConnection({
                          connectionId: receivedRequest._id,
                          token: localStorage.getItem("token"),
                          action: "accept" 
                        }))

                        // Refresh connection data after accepting
                        await dispatch(
                            getConnectionRequestsByMe({
                                token: localStorage.getItem("token")
                            })
                        );

                        await dispatch(
                            getConnectionRequestsToMe({
                                token: localStorage.getItem("token")
                            })
                        );
                    }}>Accept Invite</button>
                  ) : (
                    // No request exists --> 'CONNECT BTN'
                    <button onClick={() => {
                      dispatch(sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        user_id: profileUserId})
                      );
                    }} className={styles.connectBtn}>Connect</button>
                  )
                }


                {/* DOWNLOAD RESUME BUTTON */}
                <div onClick={async() => {
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                  // once downloaded, we can make the pdf open
                  window.open(`${BASE_URL}/${response.data.message}`, "_blank"); // '_blank' is the target

                }} style={{cursor: "pointer"}}>
                    <svg style={{height: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
                  
              </div>

              {/* User Profile */}
              <div>
                <p>{userProfile.bio}</p>
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
                          
                          {
                            post.media !== "" ? 
                              <img src={`${BASE_URL}/${post.media}`} alt="post_media" /> 
                              : 
                              <div style={{width: "3.4rem", height: "3.4rem"}}></div>
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
              {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>

          {/* DISPLAYING EDUCATION HISTORY */}
          <div className={styles.workHistory}>
            <h4>Education History</h4>
            <div className={styles.workHistoryContainer}>
                {userProfile.education.map((edu, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>{edu.school} - {edu.degree}</p>
                        <p>{edu.fieldOfStudy}</p>
                      </div>
                    )
                  })
                }
            </div>
          </div>

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

// SERVER-SIDE RENDERING
// It is used so that 'SEARCH ENGINE' can find what we are searching for
// this can be done throght the argument 'context' which will contain the url like: 'localhost:3000/user/get_profile_based_on_username?username=doraemon'
export async function getServerSideProps(context) {

  // console.log("From View");
  // console.log(context.query.username);

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params:{
      username: context.query.username
    }
  })

  const response = await request.data;
  // console.log(response);

  // Has to sent to above 'ViewProfilePage'
  return {props: {userProfile: request.data.profile}}
}
