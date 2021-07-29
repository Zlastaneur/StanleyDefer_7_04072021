import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
import styles from '../Users/DeleteAccount.module.scss'


class DeletePost extends React.Component {
    state = { redirection: false };

    constructor (props) {
        super(props)
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));
        
        this.state = {
            userId: userConnect.userId,
            isAdmin: userConnect.userAdmin
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (e) {
        e.preventDefault()

        const storage = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  storage.token;
      
        const requestOptions = {
            method: 'delete',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(this.state)
        };

        let postPage = JSON.parse(localStorage.getItem('postPage'));
        let postId = postPage.id

        fetch(('http://localhost:8080/api/posts/' + postId), requestOptions)
                .then(response => response.json())
                .then(
                    (response) => {
                        if (response.error) { 
                            this.setState({ redirection: true })
                            alert("Votre Post n'a pas pu être supprimé."); 
                        } else { 
                            this.setState({ redirection: true })   
                        }
                    }
                )
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
                }
            );
    }

    render () {
        let postPage = JSON.parse(localStorage.getItem('postPage'));
        let postId = postPage.id
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/posts' />;
        }

        return <React.Fragment>
            <div className={styles.container}>
                <h1>Êtes vous sûr de vouloir supprimer ce post ?</h1>
                <div className={styles.form}>
                    <Link to={'/post/'+ postId} className={styles.btn}>Annuler</Link>
                    <button className={styles.btn} onClick={this.handleSubmit}>Oui, je veux supprimer</button>
                </div>
            </div>
        </React.Fragment>
    };
};

export default DeletePost;