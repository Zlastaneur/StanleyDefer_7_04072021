import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img from '../../images/icon.png';
import styles from "./AllUsers.module.scss"

const AllUsers = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState([]);

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " + storage.token;
    const userId = storage.userId

    useEffect(() => {
        fetch("http://localhost:8080/api/users/", 
            {headers: 
                {"Authorization" : token}
            })
            .then(res => res.json())
            .then(
                (users) => {
                    setIsLoaded(true);
                    setUsers(users);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [token])

    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else {
        return (
            <React.Fragment>   
                <div className={styles.container}>
                    <h1 className={styles.title}>Les employés Groupomania</h1>   
                        <div className={styles.postCard} key={"postCard"}>
                            <div className={styles.user}>

                            {users.map((user) => {
                                if (userId === user.id){
                                    if (!user.imageUrl){
                                        return <div className={styles.card} key={user.id + "card"}>
                                            <Link to={"/user/" + user.id} key={user.id} ><img key={user.id + "img"} className={styles.photo} alt ="user" src={img}></img></Link>
                                            <Link to={"/user/" + user.id} key={user.id + "name"} ><div key={user.id + user.firstname} className={styles.name}>{user.firstname}  {user.lastname}</div></Link>
                                           </div>
                                    }
                                    else if (user.imageUrl) {
                                        return <div className={styles.card} key={user.id + "card"}>
                                                <Link to={"/user/" + user.id} key={user.id} ><img key={user.id + "img"} className={styles.photo} alt ="user" src={"http://localhost:8080/images/" + user.imageUrl}></img></Link>
                                                <Link to={"/user/" + user.id} key={user.id + "name"} ><div key={user.id+ user.firstname} className={styles.name}>{user.firstname}  {user.lastname}</div></Link>
                                               </div>
                                    } else return null
                                } else if (userId !== user.id){
                                    if (!user.imageUrl){
                                        return <div className={styles.card} key={user.id + "card"}>
                                            <Link to={"/users/" + user.id} key={user.id} ><img key={user.id + "img"} className={styles.photo} alt ="user" src={img}></img></Link>
                                            <Link to={"/users/" + user.id} key={user.id + "name"} ><div key={user.id + user.firstname} className={styles.name}>{user.firstname}  {user.lastname}</div></Link>
                                           </div>
                                    }
                                    else if (user.imageUrl) {
                                        return <div className={styles.card} key={user.id + "card"}>
                                                <Link to={"/users/" + user.id} key={user.id}><img key={user.id + "img"} className={styles.photo} alt ="user" src={"http://localhost:8080/images/" + user.imageUrl}></img></Link>
                                                <Link to={"/users/" + user.id} key={user.id + "name"}><div key={user.id + user.firstname} className={styles.name}>{user.firstname}  {user.lastname}</div></Link>
                                               </div>
                                    } else return null
                                } else return null
                                
                            })}
                            </div>

                        </div>
                   
                </div>
            </React.Fragment>
        );
    } 
};

export default AllUsers;
