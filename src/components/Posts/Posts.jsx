import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import styles from "./Posts.module.scss"

const Posts = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " + storage.token;

    useEffect(() => {
      fetch("http://localhost:8080/api/posts", 
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (posts) => {
                setIsLoaded(true);
                setPosts(posts);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [token])

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
                    <h1 className={styles.title}>Fil d'actualité</h1>
                    <div className={styles.newPost}>
                        <button className={styles.btn} onClick={() => {history.push("/createpost/")}}>Publier un post</button>
                    </div>
                    {posts.map((post) => (
                        <div className={styles.postCard} key={"postCard" + post.id}>
                            <div className={styles.user}>
                                {users.map((user) => {
                                        if (user.id === post.userId && user.imageUrl) {
                                        return <Link to={"/users/" + user.id} key={user.id + post.id}><img src={"http://localhost:8080/images/" + user.imageUrl} alt="user" key={"userImage" + post.id} /></Link>
                                        } else if (user.id === post.userId && !user.imageUrl) {
                                            return <img src={img} alt="user" key={"userImage" + post.id} />
                                        } else {
                                            return null
                                        }
                                })}

                                {users.map((user) => {
                                    if(user.id === post.userId){
                                        return <h2 key={"h2" +user.id}><Link to={"/users/" + user.id} key={user.id + post.id} className={styles.name}>{user.firstname} {user.lastname}</Link></h2>
                                    } else {
                                        return null
                                    }
                                })}

                            </div>
                            
                            <div className={styles.content} key={"show" + post.id}>
                                <Link to={"/post/" + post.id} key={"post" + post.id} className={styles.postTitle}>{post.title}</Link>
                                <p className={styles.text} key={"content" + post.id}>{post.content}</p>
                                {post.articleUrl ? <a className={styles.articleUrl} href={post.articleUrl}> {post.articleUrl}</a> : null }
                            </div>
                            <div className={styles.timestamp}>
                                <p key={post.createdAt} id={styles.createdAt}><Moment fromNow key={"date" + post.id}>{post.createdAt}</Moment></p>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    } 
};

export default Posts;
