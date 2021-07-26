import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import styles from './UpdatePhoto.module.scss';

class UpdatePhoto extends React.Component {

    state = { redirection: false }
    constructor(props) {
        const storage = JSON.parse(localStorage.getItem('userConnect'));

        super(props)
        this.state = {
            userId: storage.userId,
            isAdmin: storage.userAdmin,
            redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) { 
        e.preventDefault();

        const formData = new FormData();
        const imagedata = document.querySelector('input[type="file"]').files[0];
        formData.append('image', imagedata);

        const storage = JSON.parse(localStorage.getItem('userConnect'));
        const userId = storage.userId;
        let token = "Bearer " +  storage.token;
    
        fetch("http://localhost:8080/api/users/" + userId,
        {
            method: 'put',
            headers: {"Authorization" : token}, 
            body: formData 
        })
        .then((res) => { 
            this.setState({ redirect: true })
            if (res.ok) { 
            alert("Votre photo à été modifiée !"); 
            } else if (res.status === 401) { 
                alert("Une erreur s'est produite ! "); 
            } 
            }, function (e) { 
                alert("Une erreur s'est produite : " + e); 
            }); 
        } 

    render() {
        const storage = JSON.parse(localStorage.getItem('userConnect'));
        const userId = storage.userId;

        const { redirect } = this.state;
        if (redirect) {
         return <Redirect to={'/user/' + userId}/>;
      }

    return <div className={styles.container}>
                <h1 className={styles.title}>Modifier la photo de Profil</h1>
                <div className={styles.updatePhoto}>
                    <form className={styles.form} onSubmit={this.handleSubmit}>
                        <input className={styles.input} type="file" name="imageUrl" />
                        <button className={styles.submit} type="Submit">Modifier</button>
                    </form>
                    <div className={styles.cancel}>
                        <Link to={'/user/' + userId} className={styles.back}>Annuler</Link>
                    </div>
                </div>
        </div>
    }
}

export default UpdatePhoto;