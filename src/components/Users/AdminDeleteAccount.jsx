import React, { useState, useCallback} from 'react';
import { Redirect, Link } from 'react-router-dom';
import styles from "./DeleteAccount.module.scss"


function DeleteUserAccount ({ match }) {
    const [redirect, setRedirect] = useState(false);
    const storage = JSON.parse(localStorage.getItem('userConnect'));
    let token = "Bearer " +  storage.token;
    let userId = match.params.id;

    const handleSubmit = useCallback(function (value) {

        fetch(('http://localhost:8080/api/users/' + userId), {
            method: "delete",
            headers: 
                { "Content-type" : 'application/json',
                'Authorization': token
                },
            body: JSON.stringify({
                id: value.id,
                userId: storage.userId,
                isAdmin: storage.userAdmin
            })
        })
        .then(res => res.json())
        .then(
            (res) => {
                if (res.error) { 
                    alert("Ce compte n'a pas été supprimé."); 
                } else { 
                    setRedirect(true);
                }
            }
        )
        .catch(error => {
            this.setState({ Erreur: error.toString() });
            alert("Ce compte n'a pas été supprimé !");
            console.error('There was an error!', error);
        })
    }, [userId, storage.userAdmin, storage.userId, token])

    return (
        <React.Fragment>
            {redirect ? <Redirect to="/posts/" /> : null}
            <div className={styles.container}>
            <h1>Êtes vous sûr de supprimer ce compte ?</h1>
            <div className={styles.form}>
                <Link to={'/user/' + userId} className={styles.btn}>Annuler</Link>
                <button className={styles.btn} onClick={handleSubmit}>Oui je veux supprimer</button>
            </div>
        </div>
        </React.Fragment>
    );
}

export default DeleteUserAccount;