import React from 'react';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { BASE_URL } from '@/config';

export default function NavBarComponent() {

  const router = useRouter(); // to direct user to the login page if not logged in 'Be a part'

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>

        <h1 onClick={() => {router.push("/")}} style={{cursor: "pointer"}} >Pro Connect</h1>

        <div className={styles.navBarOptionContainer}>

          { /* If profile is fetched then show user's name and 'PROFILE ICON' */ }
          {authState.profileFetched && <div>
              <div style={{display: "flex", gap: "1.2rem", alignItems: "center"}}>
                {/* <p>Hey, {authState.user.userId.name}</p> */}
                <img onClick={() => {
                  router.push("/profile")

                }} className={styles.userProfile} src={authState.user.userId.profilePicture} alt="" />

                {/* Logout */}
                <p onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/auth")
                  dispatch(reset())
                }} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</p>
              </div> 
            </div>}

          {
            // only if profile not fetched then show the button 'Be a part'
          }
          {!authState.profileFetched && 
            <div onClick={() => {router.push("/auth")}} className={styles.buttonJoin}><p>Be a part</p></div> 
          }
        </div>

      </nav>
    </div>
  )
}
