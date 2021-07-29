import React from 'react';
import { Redirect } from 'react-router-dom';
import styles from "./Signup.module.scss"

class Signup extends React.Component {
    state = { redirection: false}

    constructor (props){
        super(props)
        this.state = {
            firstname: undefined || '',
            lastname: undefined || '',
            email: undefined || '',
            password: undefined || '',
            errors: {
                firstname: undefined || '',
                lastname: undefined || '',
                email: undefined || '',
                password: undefined || '',
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        let errors = this.state.errors;

        const validEmailRegex = RegExp(/^(([^<>()[\].,;:s@"]+(.[^<>()[\].,;:s@"]+)*)|(".+"))@(([^<>()[\].,;:s@"]+.)+[^<>()[\].,;:s@"]{2,})$/i);
    
    switch (name){
        case 'firstname': 
              errors.firstname = 
                value.length < 2
                  ? 'Au moins 2 lettres minimum !'
                  : '';
              break;
              case 'lastname': 
              errors.lastname = 
                value.length < 2
                  ? 'Au moins 2 lettres minimum !'
                  : '';
              break;
            case 'email': 
              errors.email = 
                validEmailRegex.test(value)
                  ? ''
                  : "Merci d'entrer un email valide !";
              break;
            case 'password': 
              errors.password = 
                value.length < 6
                  ? 'Votre mot de passe doit contenir au minimum 6 caractères !'
                  : '';
              break;
            default:
              break;
          }
          this.setState({
              errors, [name]: value
          })
    }

    handleSubmit (e) {
        e.preventDefault()

        const validateForm = (errors) => {
            let valid = true;
            Object.values(errors).forEach(
                (val) => val.length > 0 && (valid = false)
            );
            return valid;
            }

        if(validateForm(this.state.errors)) {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token' 
                },
                body: JSON.stringify(this.state)
            };
    
            fetch('http://localhost:8080/api/auth/signup/', requestOptions)
                .then(response => response.json())
                .then((response) => {
                    if (response.error) { 
                        alert("Erreur : " + response.error); 
                    } else { 
                        this.setState({ redirection: true })
                        alert("Compte créé ! Connectez-vous pour accéder à Groupomania")
                    }
                })
                .catch(error => {
                    this.setState({ Erreur: error.toString() });
                    alert("Merci de remplir les champs demandés")
                    console.error('Erreur :', error);
                });

          } else {
            alert('Formulaire invalide, merci de recommencer !')
          }
    }

    
    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/login'/>;
        }

        const {errors} = this.state;

        return <React.Fragment>
            <div className={styles.container}>
                <h1>Inscrivez-vous !</h1>
                <h2>C'est rapide et facile.</h2>
                <form className={styles.form}>
                    <div className={styles.duoField}>
                        <div className={styles.field}>
                            <input type="text" value={this.state.firstname} onChange={this.handleChange} placeholder ={"Prénom"} name="firstname" className="firstname" required noValidate/>
                            {errors.firstname.length > 0 && 
                                <span className={styles.error}>{errors.firstname}</span>}
                        </div>
                        <div className={styles.field}>
                            <input type="text" value={this.state.lastname} onChange={this.handleChange} placeholder ="Nom" name="lastname" className="lastname" required noValidate/>
                            {errors.lastname.length > 0 && 
                                <span className={styles.error}>{errors.lastname}</span>}
                        </div>
                    </div>
                        <div className={styles.field}>
                            <input type="text" value={this.state.email} onChange={this.handleChange} placeholder ="Email" name="email" className="email" required noValidate/>
                            {errors.email.length > 0 && 
                                <span className={styles.error}>{errors.email}</span>}
                        </div>
                        <div className={styles.field}>
                            <input type="password" value={this.state.password} onChange={this.handleChange} placeholder ="Mot de Passe" name="password" className="password" required noValidate/>
                            {errors.password.length > 0 && 
                                <span className={styles.error}>{errors.password}</span>}
                        </div>
                        <div className={styles.submit}>
                            <button className={styles.btn} onClick={this.handleSubmit} noValidate>Envoyer !</button>
                        </div>
                </form>
            </div>
        </React.Fragment>
    };
};

export default Signup;