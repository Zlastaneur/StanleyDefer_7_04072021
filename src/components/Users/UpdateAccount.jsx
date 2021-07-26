import * as React from 'react';
import {Redirect, Link} from 'react-router-dom';
import FormField from '../FormField';
import Form from 'react-bootstrap/Form'
import styles from "./UpdateAccount.module.scss"

class UpdateAccount extends React.Component {

    state = { redirection: false };

    constructor (props) {
        super(props)
        const userAccount = JSON.parse(localStorage.getItem('userAccount'));
        const userConnect = JSON.parse(localStorage.getItem('userConnect'));

        this.state = {
            userId: userConnect.userId,
            isAdmin: userConnect.userAdmin,
            firstname: userAccount.firstname,
            lastname: userAccount.lastname,
            bio: userAccount.bio || '',
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
        const userId = storage.userId
        let token = "Bearer " +  storage.token;

        const requestOptions = {
            method: 'put',
            headers: { 
                "Content-type" : 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(this.state)
        };

        fetch(('http://localhost:8080/api/users/' + userId), requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (response.error) { 
                        alert("Votre compte n'a pas été modifié : " + response.error)
                    } else { 
                        this.setState({ redirection: true })
                    }
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    console.error('Error', error);
            });
    }

    render() {
        const userAccount = JSON.parse(localStorage.getItem('userAccount'));
        const userId = userAccount.id;

        const { redirection } = this.state;

        if (redirection) {
            return <Redirect to={'/user/' + userId}/>;
        }

        return <React.Fragment>
            <div className={styles.container}>
                <h1 className={styles.title}>Modifier votre profil</h1>
                <form className={styles.form}>
                    <FormField name="firstname" value={this.state.firstname} onChange={this.handleChange}>Prénom</FormField>
                    <FormField name="lastname" value={this.state.lastname} onChange={this.handleChange}>Nom</FormField>
                    <Form.Group className={styles.group} controlId="exampleForm.ControlTextarea1" >
                        <Form.Label>Rédigez une bio</Form.Label>
                        <Form.Control as="textarea" rows={5} name="bio" value={this.state.bio} onChange={this.handleChange} />
                    </Form.Group>
                    <div className={styles.submit}>
                        <button className={styles.btn} onClick={this.handleSubmit}>Enregistrer</button>
                        <Link to={'/user/' + userId} className={styles.btn}>Annuler</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default UpdateAccount;