import React, {useCallback} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import Cookies from 'js-cookie';
import styles from "./DeleteAccount.module.scss"

import { useHistory } from 'react-router-dom';

function DeleteAccount () {
    const Auth = React.useContext(AuthContext);
    const history = useHistory();

    const storage = JSON.parse(localStorage.getItem('userConnect'));
    const userId = storage.userId;
    const isAdmin = storage.userAdmin;
    let token = "Bearer " +  storage.token;

    const handleSubmit = useCallback(function (value) {


        fetch(('http://localhost:8080/api/users/' + userId), {
            method: "delete",
            headers: 
                { "Content-type" : 'application/json',
                'Authorization': token
                },
            body: JSON.stringify({
                id: value.id,
                userId: userId,
                isAdmin: isAdmin
            })
        })
        .then(res => res.json())
        .then(
            (res) => {
                if (res.error) { 
                    alert("Votre compte n'a pas été supprimé."); 
                } else { 
                    Auth.setAuth(false);
                    Cookies.remove("user");
                    localStorage.clear();
                    history.push("/");
                }
            }
        )
        .catch(error => {
            this.setState({ Erreur: error.toString() });
            alert("Votre compte n'a pas été supprimé !");
            console.error('There was an error!', error);
        })
    }, [Auth, isAdmin, userId, token, history])

    return (
        <div className={styles.container}>
            <h1>Êtes vous sûr de vouloir supprimer votre compte ?</h1>
            <div className={styles.form}>
                <Link to={'/user/' + userId} className={styles.btn}>Annuler</Link>
                <button className={styles.btn} onClick={handleSubmit}>Oui je veux supprimer</button>
            </div>
        </div>
    );
}

export default DeleteAccount;