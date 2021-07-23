import React from 'react';
import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import smallIcon from "../../images/icon-white.png";
import longIcon from "../../images/icon-left-white.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSignInAlt, faHome, faUserFriends, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import Cookies from "js-cookie"

export default function Header(){
 
    const signupIcon = <FontAwesomeIcon icon={faUserPlus} size="2x" color="white"/>
    const loginIcon = <FontAwesomeIcon icon={faSignInAlt} size="2x" color="white"/>
    const postsIcon = <FontAwesomeIcon icon={faHome} size="2x" color="white"/>
    const employeeIcon = <FontAwesomeIcon icon={faUserFriends} size="2x" color="white"/>
    const profilIcon = <FontAwesomeIcon icon={faUserCircle} size="2x" color="white"/>


    const [auth, setAuth] = React.useState(false);



     // Cookies
        const readCookie = () => {
        const user = Cookies.get("user");
        if(user) {
            setAuth(true);
        }
    }

    React.useEffect(() => {
        readCookie();
    }, [])


  let navLink;

  console.log(auth);

  if (auth === true) {
      const userLog = JSON.parse(localStorage.getItem('userConnect'));
      const userId = userLog.userId;

      navLink = <>
              <nav className={styles.nav}>
                  <Link to="/posts" className={styles.posts}>{postsIcon}</Link>
                  <Link to={"/user/" + userId } className={styles.user}>{profilIcon}</Link>
              </nav>
            </>
  } else {
      navLink = 
      <nav className={styles.nav}>
              <Link to="/signup" className={styles.signup}>{signupIcon}</Link>
              <Link to="/login" className={styles.login}>{loginIcon}</Link>
          </nav>
  }

    return (
        <header className={styles.header}>
           <Link to="/" className={styles.logo}><img src={longIcon} alt="logo" className={styles.longIcon}/>
           <img src={smallIcon} alt="logo" className={styles.smallIcon}/></Link>
            {navLink}
        </header>
    )
}