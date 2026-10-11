import React, { useEffect } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import UserLayout from '../../layout/UserLayout'
import { useDispatch, useSelector } from 'react-redux'
import { acceptConnection, getConnectionRequestsToMe, getMyNetwork } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from "./index.module.css";
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {

  const dispatch = useDispatch();

  const router = useRouter();

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    // to get connection requests sent to me
    dispatch(getConnectionRequestsToMe({token: localStorage.getItem("token")}));

    // to get all accepted connections in my network
    dispatch(getMyNetwork({token: localStorage.getItem("token")}));
  }, [])

  useEffect(() => {
    if(authState.connectionRequest.length !== 0){
      // console.log(`From CONNECTIONS PAGE ${authState.connectionRequest}`)
    }
  }, [authState.connectionRequest])

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display: "flex", flexDirection: "column", gap: "1.7rem"}}>
          <h4>My Connections</h4>

          {
            // filter((connection) => connection.status_accepted === null) --> will show requests in 'PENDING' state ..... i fthis check is not there then .... <h2>No Connection Requests Pending</h2> WON'T BE IMPLEMENTED
            authState.connectionRequest.filter((connection) => connection.status_accepted === null).length === 0 && (
              <h2>No Connection Requests Pending</h2>)
          }

          { // To show requests which are neither accepted nor rejected
            // if there is no connection requests then do NOT perform any operation else do:
            authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
              // 'filter((connection) => connection.status_accepted === null)' --> will filter that connection requests whose status is 'null', if it is not done then it will show 'ACCEPTED' & 'REJECTED' connection requests in the list as well.
              return(
                <div onClick={() =>{
                  router.push(`/view_profile/${user.userId.username}`)

                }} className={styles.userCard} key={index}>
                  <div style={{display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between"}}>
                    <div className={styles.profilePicture}>
                      <img src={user.userId.profilePicture} alt="profile" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>

                    <div style={{display: "flex", gap: "1rem"}}>
                      <button onClick={(e) =>{
                        e.stopPropagation();
                        dispatch(acceptConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                            action: "accept" 
                          }))
                        }} className={styles.connectedButton}>
                        Accept
                      </button>

                      <button onClick={(e) =>{
                        e.stopPropagation();
                        dispatch(acceptConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                            action: "decline" 
                          }))
                        }} className={styles.connectedButton}>
                        Decline
                      </button>
                    </div>

                  </div>
                </div>
              )
            })
          }

          <h4>My Network</h4>
          { // To show the 'ACCEPTED' requests
            authState.myNetwork.map((user) => {
              return(
                <div onClick={() =>{
                  router.push(`/view_profile/${user.username}`)

                }} className={styles.userCard} key={user._id}>
                  <div style={{display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between"}}>
                    <div className={styles.profilePicture}>
                      <img src={user.profilePicture} alt="profile" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.name}</h3>
                      <p>@{user.username}</p>
                    </div>
                  </div>
                </div>
              )
            }) 
          }


        </div>
      </DashboardLayout>
    </UserLayout>
  )
}