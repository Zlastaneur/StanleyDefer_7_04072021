import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
import FormField from './FormField';
import styles from "./CreatePost.module.scss"
import Form from 'react-bootstrap/Form'


class CreateArticle extends React.Component {

    state = { redirection: false };

    constructor (props) {
        super(props)

        const userConnect = JSON.parse(localStorage.getItem('userConnect'));

        this.state = {
            userId: userConnect.userId,
            isAdmin: userConnect.userAdmin,
            title: undefined || '',
            content: undefined || '',
            articleUrl: undefined || ''
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
            method: 'post',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(this.state)
        };

        fetch(('http://localhost:8080/api/posts/'), requestOptions)
                .then(response => response.json())
                .then(
                    (response) => {
                    if (response.error) { 
                        alert("Votre post ne peut être publié : " + response.error); 
                    } else { 
                        this.setState({ redirection: true })
                        alert("Votre post a été publié !")
                    }
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('Error', error);
            });
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/posts' />;
        }

        return <React.Fragment>
            <div className={styles.container}>
                <h1 className={styles.title}>Publier un post</h1>
                <form className={styles.form}>
                    <FormField name="title" value={this.state.title} onChange={this.handleChange}>Titre</FormField>
                    <Form controlId="exampleForm.ControlTextarea1" className={styles.field}>
                        <Form.Label>Contenu du post</Form.Label>
                        <Form.Control as="textarea" rows={5} name="content" value={this.state.content} onChange={this.handleChange} />
                    </Form>
                    <FormField name="articleUrl" value={this.state.articleUrl} onChange={this.handleChange}>URL d'un article (facultatif)</FormField>
                    <div className={styles.submit}>
                        <button className={styles.btn} onClick={this.handleSubmit}>Publier</button>
                        <Link to='/posts' className={styles.btn}>Retour</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default CreateArticle;