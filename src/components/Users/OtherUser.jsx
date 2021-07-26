import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import styles from './User.module.scss'

const OtherUser = ({match}) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);
    const [posts, setPost] = useState([]);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = match.params.id;
    let token = "Bearer " +  storage.token;

    useEffect(() => {
      fetch("http://localhost:8080/api/users/" + userId,
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (user) => {
                setIsLoaded(true);
                setUser(user);
                localStorage.setItem('userAccount', JSON.stringify(user));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [userId, token])

    useEffect(() => {
        fetch("http://localhost:8080/api/users/" + userId + "/posts/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (posts) => {
                    setIsLoaded(true);
                    setPost(posts);
                    localStorage.setItem('userPosts', JSON.stringify(posts));
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [userId, token])

    
    let idUser;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (storage.userAdmin === true) {
        idUser = <div className="user-button">  
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/adminuserdelete/" + userId)}}>Supprimer</button>
        </div>
    } // admin

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.userProfil}>
                    <div className={styles.cover}>
                        <div className={styles.profilPicture}>
                            {user.imageUrl ?
                                <img
                                src={"http://localhost:8080/images/" + user.imageUrl}
                                alt="user"
                                key={"userImage" + user.id}
                                className={styles.img}
                                /> : 
                                <img
                                src={img}
                                alt="user"
                                key={"userImage" + user.id}
                                className={styles.img}
                                />
                            }
                        </div>
                    </div>
                    <div className={styles.info}>
                        <h2 className={styles.name} >{user.firstname} {user.lastname}</h2>
                        {user.bio ? <p className={styles.bio}>" {user.bio} "</p> : null }
                    </div>
                    {idUser}
                </div>

                    {posts.length === 0 ? null : 
                    <div className={styles.postsTitle}>
                        <h2>Publications</h2> 
                    </div> }

                    {posts.map((post) => (
                        <div className={styles.userPosts} key={"user" + post.id}>
                            <Link to={"/post/" + post.id} key={"post" + post.id} className={styles.postTitle}>{post.title}</Link>
                            <p className={styles.content} key={"posts" + post.id}>{post.content}</p>
                            <h3 className={styles.createdAt} key={"date" + post.id}>Publié le&nbsp; <Moment key={"date" + post.id} format="DD MMM YYYY" date={post.createdAt} /></h3>
                        </div>
                    ))}
                
            </div>
        </React.Fragment>
    );
};

export default OtherUser;