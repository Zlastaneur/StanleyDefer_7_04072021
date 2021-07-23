import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const Home = () => {

    const signupIcon = <FontAwesomeIcon icon={faUserPlus} color="white"/>
    const loginIcon = <FontAwesomeIcon icon={faSignInAlt} color="white"/>

    return (
        <React.Fragment>
            <div className={styles.container}>
                <h1 className={styles.title}>Bienvenue sur le réseau social de Groupomania !</h1>
                <Link to="/signup"><button className={styles.btn}>{signupIcon} S'inscrire</button></Link>
                <Link to="/login"><button className={styles.btn}>{loginIcon} Se connecter</button></Link>
            </div>
        </React.Fragment>
    );
}

export default Home;