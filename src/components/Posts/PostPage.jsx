import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import Comments from "../Comments/Comments";
import img from '../../images/icon.png';
import styles from "./PostPage.module.scss"



function PostPage ({ match }) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [post, setPost] = useState([]);
    const [users, setUsers] = useState([]);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " +  storage.token;
    let userId = storage.userId;
    
    let postId = match.params.id;

    useEffect(() => {
      fetch("http://localhost:8080/api/posts/" + postId, 
        {headers: 
            {"Authorization" : token}
        })
        .then(res => res.json())
        .then(
            (post) => {
                setIsLoaded(true);
                setPost(post);
                localStorage.setItem('postPage', JSON.stringify(post));
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [postId, token])

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

    let userAuth;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (post.userId === storage.userId) {
        userAuth = <div className="post-button">
            <button className="btn btn-outline-info btn-sm" onClick={() => {history.push("/postupdate/" + postId)}}>Modifier</button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/postdelete/" + postId)}}>Supprimer</button>
        </div>
    } else if (storage.userAdmin === true){
        userAuth = <div className="post-button">
            <button className="btn btn-outline-danger btn-sm" onClick={() => {history.push("/postdelete/" + postId)}}>Supprimer</button>
        </div>
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.postCard} key={"postCard" + post.id}>
                            <div className={styles.user}>

                            {users.map((user) => {
                                        if (user.id === post.userId && user.imageUrl && user.id !== userId) {
                                        return <Link to={"/users/" + user.id} key={user.id + post.id}><img src={"http://localhost:8080/images/" + user.imageUrl} alt="user" key={"userImage" + post.id} /></Link>
                                        } else if (user.id === post.userId && user.imageUrl && user.id === userId) {
                                            return <Link to={"/user/" + user.id} key={user.id + post.id}><img src={"http://localhost:8080/images/" + user.imageUrl} alt="user" key={"userImage" + post.id} /></Link>
                                        }
                                        else if (user.id === post.userId && !user.imageUrl && user.id !== userId ) {
                                            return <Link to={"/users/" + user.id} key={user.id + post.id}><img src={img} alt="user" key={"userImage" + post.id} /></Link>
                                        } else if (user.id === post.userId && !user.imageUrl && user.id === userId) {
                                            return <Link to={"/user/" + user.id} key={user.id + post.id}><img src={img} alt="user" key={"userImage" + post.id} /></Link>
                                        } 
                                        else {
                                            return null
                                        }
                                })}

                                {users.map((user) => {
                                    if(user.id === post.userId && user.id !== userId ){
                                        return <Link to={"/users/" + user.id}><h2 key={"h2" +user.id} className={styles.name}>{user.firstname}<br></br>{user.lastname}</h2></Link>
                                    } else if (user.id === post.userId && user.id === userId){
                                        return <Link to={"/user/" + user.id}><h2 key={"h2" +user.id} className={styles.name}>{user.firstname}<br></br>{user.lastname}</h2></Link>
                                    } else {
                                        return null
                                    }
                                })}

                            </div>
                            
                            <div className={styles.content} key={"show" + post.id}>
                                <Link to={"/post/" + post.id} key={"post" + post.id} className={styles.postTitle}>{post.title}</Link>
                                <p className={styles.text} key={"content" + post.id}>{post.content}</p>
                                {post.articleUrl ? <a className={styles.articleUrl} href={post.articleUrl}> {post.articleUrl}</a> : null }
                            <div className={styles.timestamp}>
                                <p key={post.createdAt} id={styles.createdAt}><Moment fromNow key={"date" + post.id}>{post.createdAt}</Moment></p>
                            </div>
                            </div>
                        </div>
                <Comments />
            </div>
        </React.Fragment>
    );
};

export default PostPage;