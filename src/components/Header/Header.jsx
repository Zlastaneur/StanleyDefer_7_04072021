import React from 'react';
import styles from "./Header.module.scss"
import { Link } from "react-router-dom";
import smallIcon from "../../images/icon-white.png";
import longIcon from "../../images/icon-left-white.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

export default function Header(){
 
    const signupIcon = <FontAwesomeIcon icon={faUserPlus} size="2x" color="white"/>
    const loginIcon = <FontAwesomeIcon icon={faSignInAlt} size="2x" color="white"/>

    const [auth] = React.useState(false);

  let navLink;
  if (auth === true) {
      const userLog = JSON.parse(localStorage.getItem('userConnect'));
      const userId = userLog.userId;

      navLink = <>
              <nav className="nav">
                  <Link to="/posts" className="posts">Fil d'actualité</Link>
                  <Link to={"/user/" + userId } className="user">Mon compte</Link>
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