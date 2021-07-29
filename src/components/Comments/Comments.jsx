import * as React from 'react';
import {Link, withRouter} from 'react-router-dom';
import Moment from 'react-moment';
import img from '../../images/icon.png';
import Form from 'react-bootstrap/Form'
import styles from "./Comments.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

class Comments extends React.Component {

    constructor (props) {
        super(props)
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));

        this.state = {
            userId: userConnect.userId,
            postId: '',
            content: undefined,
            comments: [],
            users: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  userConnect.token;

        const postId = this.props.match.params.id;

    
        
        fetch("http://localhost:8080/api/posts/" + postId + "/comments/" ,
            {headers: 
                {"Authorization" : token},
            })
            .then(res => res.json())
            .then(
                (comments) => {
                    this.setState({comments});
                })
            .catch(error => {
                this.setState({ Erreur: error.toString() });
                console.error('There was an error!', error);
            }
        )

        fetch("http://localhost:8080/api/users/", 
            {headers: 
                {"Authorization" : token}
            })
            .then(res => res.json())
            .then((users) => {
                    this.setState({users});
                }
            )
            .catch(error => {
                this.setState({ Erreur: error.toString() });
                console.error('There was an error!', error);
            }
        )
    }

    handleChange (e) {
        const postPage = JSON.parse(localStorage.getItem('postPage'));
        const postId = postPage.id;

        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        const userId = userConnect.userId;

        const name = e.target.name;
        const value =  e.target.value;
        this.setState({
            postId: postId,
            userId: userId,
            [name]: value
        })
    }

    handleSubmit (e) {
        e.preventDefault()

        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  userConnect.token;
      
        const requestOptions = {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(this.state)
        };

        fetch(('http://localhost:8080/api/comments/'), requestOptions)
                .then(response => response.json())
                .then((comments) => 
                    this.setState({comments}),
                    alert("Commentaire publié !")
                )
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error("Une erreur s'est produite!", error);
            });
        
            this.setState({
                postId: '',
                userId: '',
                content: '',
            })
    }

    render() {
        const {comments} = this.state;
        const {users} = this.state;
        const deleteIcon = <FontAwesomeIcon icon={faTrash} color="white"/>

        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        const userId = userConnect.userId

        return ( 
            <div className={styles.container}>
                <div className={styles.newComment}>
                <div className={styles.picture}>
                    {users.map((user) => {
                        if (user.id === userId && user.imageUrl) {
                            return <img
                            src={"http://localhost:8080/images/" + user.imageUrl}
                            alt="user"
                            key={"userImages" + user.id}
                            className={styles.newPostImg}
                        />
                        } else if (user.id === userId && !user.imageUrl) {
                            return <img
                            src={img}
                            alt="user"
                            key={"userImage" + user.id}
                            className={styles.newPostImg}
                        />
                        } else {
                            return null
                        }
                    })}
                </div>
                    <Form.Group className={styles.form} controlId="exampleForm.ControlTextarea1" >
                        <Form.Control placeholder="Écrivez votre commentaire" as="textarea" rows={2} name="content" value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <div className={styles.submit}>
                        <button className={styles.btn} onClick={this.handleSubmit}>Envoyer</button>
                    </div>
                </div>
                 {comments.map((comment) => (
                        <div className={styles.comment} key={"divimg" + comment.id}>
                            {users.map((user) => {
                                if (user.id === comment.userId && user.imageUrl) {
                                return <Link to={"/users/" + user.id}><img className={styles.img} src={"http://localhost:8080/images/" + user.imageUrl} alt="user" key={"userImage" + comment.id} /></Link>
                                } else if (user.id === comment.userId && !user.imageUrl) {
                                    return <Link to={"/users/" + user.id}><img className={styles.img} src={img} alt="user" key={"userImages" + comment.id} /></Link>
                                } else {
                                    return null
                                }
                            })}
                            <div className={styles.card} key={"fragment" + comment.id}>
                                <div className={styles.header}>       
                                {users.map((user) => {
                                    if(comment.userId === user.id && comment.userId !== userId){
                                    return <Link to={"/users/" + user.id} key={comment.id + user.id} className={styles.userLink}>{user.firstname} {user.lastname}</Link>
                                    } else if (comment.userId === user.id && comment.userId === userId){
                                        return <Link to={"/user/" + user.id} key={comment.id + user.id +"key"} className={styles.userLink}>{user.firstname} {user.lastname}</Link>
                                    }else {
                                        return null
                                    }
                                })}
                                {comment.userId === userConnect.userId || userConnect.userAdmin === true
                                    ? <div className={styles.delete}>
                                        <Link to={"/deletecomment/" + comment.id} key={"delete"+ comment.id} className={styles.deleteBtn}>{deleteIcon}</Link>
                                    </div> : null
                                }
                                </div>
                                <p key={"comment" + comment.id} className={styles.content}>{comment.content}</p>
                            </div>
                                <p key={"commenth3" + comment.id} className={styles.timeStamp}><Moment fromNow key={"date" + comment.id}>{comment.createdAt}</Moment></p>
                    </div>
                ))}
            </div>
        )
    };
};

export default withRouter(Comments);