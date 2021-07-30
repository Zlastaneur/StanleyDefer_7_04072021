import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import AuthContext from '../AuthContext';
import Cookies from 'js-cookie';
import styles from "./User.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSignOutAlt, faUserEdit, faCamera, faCrown} from '@fortawesome/free-solid-svg-icons'


const User = () => {

    const modifyIcon = <FontAwesomeIcon icon={faUserEdit} color="white"/>
    const deleteIcon = <FontAwesomeIcon icon={faTrash} color="white"/>
    const disconnectIcon = <FontAwesomeIcon icon={faSignOutAlt} color="white"/>
    const modifyImgIcon = <FontAwesomeIcon icon={faCamera} color="white"/>
    const crownIcon = <FontAwesomeIcon icon={faCrown}className={styles.crownIcon }/>


    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState([]);
    const [posts, setPost] = useState([]);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = storage.userId;
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
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [userId, token])

    const Auth = React.useContext(AuthContext);

    const handleOnclick = () => {
        Auth.setAuth(false);
        Cookies.remove("user");
        localStorage.clear();
    }

    let idUser;
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else if (user.id === userId || user.isAdmin === true) {
        idUser = <div className={styles.userButton}>
            <button className={styles.btn} onClick={() => {history.push("/updateaccount/" + userId)}}>{modifyIcon}</button>
            <button className={styles.btn} onClick={() => {history.push("/userdelete/" + userId)}}>{deleteIcon}</button>
            <button className={styles.btn} onClick={handleOnclick}>{disconnectIcon}</button>  
        </div>
    }
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.userProfil}>
                    {storage.userAdmin === true ?
                    <div className={styles.admin}>{crownIcon}</div> : <></>}
                    {idUser}
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
                                <button className={styles.btn} onClick={() => {history.push("/updatephoto/" + userId)}}>{modifyImgIcon}</button>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <h2 className={styles.name} >{user.firstname} {user.lastname}</h2>
                        {user.bio ? <p className={styles.bio}>" {user.bio} "</p> : null }
                    </div>
                </div>
                
                    {posts.length === 0 ? null : 
                    <div className={styles.postsTitle}>
                        <h2>Publications</h2> 
                    </div> }
                    
                    {posts.map((post) => (
                        <div className={styles.userPosts} key={"user" + post.id}>
                            <Link to={"/post/" + post.id} key={"postt" + post.id}>
                            <h3 key={"post" + post.id} className={styles.postTitle}>{post.title}</h3>
                            <p className={styles.content} key={"posts" + post.id}>{post.content}</p>
                            <h3 className={styles.createdAt} key={"date" + post.id}>Publié le&nbsp;<Moment key={"date" + post.id} format="DD MMM YYYY" date={post.createdAt} /></h3>
                            </Link>
                        </div>
                    ))}
                </div>
            
        </React.Fragment>
    );
};

export default User;

