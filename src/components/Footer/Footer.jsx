import React from 'react';
import styles from "./Footer.module.scss"


export default function Footer(){
    return (
        <footer className={styles.footer}>
                <p className={styles.copyright}>Groupomania © 2021</p>
        </footer>
    )
}