import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
import FormField from '../FormField';
import Form from 'react-bootstrap/Form'
import styles from "../Users/UpdateAccount.module.scss"


class UpdatePost extends React.Component {

    state = { redirection: false };

    constructor (props) {
        super(props)
        const postPage = JSON.parse(localStorage.getItem('postPage'));
        const storage = JSON.parse(localStorage.getItem('userConnect'));

        this.state = {
            userId: storage.userId,
            isAdmin: storage.userAdmin,
            title: postPage.title,
            content: postPage.content,
            articleUrl: postPage.articleUrl
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (e) {
        const name = e.target.name;
        const value =  e.target.value;
        this.setState({
            [name]: value
        })
    }

    handleSubmit (e) {
        e.preventDefault()

        const storage = JSON.parse(localStorage.getItem('userConnect'));
        let token = "Bearer " +  storage.token;
      
        const requestOptions = {
            method: 'put',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(this.state)
        };

        let postPage = JSON.parse(localStorage.getItem('postPage'));
        let postId = postPage.id;

        fetch(('http://localhost:8080/api/posts/' + postId), requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (response.error) { 
                        alert("Erreur : " + response.error); 
                    } else { 
                        this.setState({ redirection: true })
                    }
                }
                )
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('There was an error!', error);
            });
    }

    render() {
        const { redirection } = this.state;
        const postId = this.props.match.params.id;
        if (redirection) {
            return <Redirect to={'/post/' + postId}/>;
        }

        return <React.Fragment>
            <div className={styles.container}>
                <h1 className={styles.title}>Modifiez ce post</h1>
                <form className={styles.form}>
                    <FormField name="title" value={this.state.title} onChange={this.handleChange}>Titre</FormField>
                    <Form.Group className={styles.group} controlId="exampleForm.ControlTextarea1" >
                        <Form.Label>Contenu du post</Form.Label>
                        <Form.Control as="textarea" rows={8} name="content" value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <FormField className={styles.article} name="articleUrl" value={this.state.articleUrl} onChange={this.handleChange}>Partagez un lien d'article</FormField>
                    <div className={styles.submit}>
                        <button className={styles.btn} onClick={this.handleSubmit}>Enregistrer</button>
                        <Link to='/posts/' className={styles.btn}>Annuler</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default UpdatePost;