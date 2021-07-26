import React, {useState, useCallback, useContext, useMemo, createContext} from 'react';
import AuthContext from '../AuthContext'
import styles from "./Login.module.scss"
import Cookies from "js-cookie"


const FormContext = createContext({})

function FormWithContext ({defaultValue, onSubmit, children}) {

    const [users, setData] = useState(defaultValue)

    const change = useCallback(function (name, value) {
        setData(d => ({...d, [name]: value}))
    }, [])

    const value= useMemo(function () {
        return {...users, change}
    }, [users, change])

    const handleSubmit = useCallback(function (e) {
        e.preventDefault()
        onSubmit(value)
    }, [onSubmit, value])

    return <FormContext.Provider value={value}>
        <form className={`${styles.field} ${styles.form}`} onSubmit={handleSubmit}>
            {children}
        </form>
    </FormContext.Provider>
}

function FormField ({name, type, children}) {
    const users = useContext(FormContext)
    const handleChange = useCallback(function (e) {
        users.change(e.target.name, e.target.value)
    }, [users])

    return <div className={styles.field}>
        <input type={type} name={name} id={name} placeholder ={children} className={styles.input} value={users[name] || ''} onChange={handleChange}/>
    </div>
}

function PrimaryButton ({children}) {
    return <button className={styles.btn}>{children}</button>
}

function Login () {
    localStorage.clear();
    const [error, setError] = useState(null);
    const Auth = React.useContext(AuthContext);

    const handleSubmit = useCallback(function (value) {

        fetch("http://localhost:8080/api/auth/login/", {
            method: "post",
            headers: { "Content-type" : 'application/json'},
            body: JSON.stringify({
                email: value.email,
                password: value.password
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                localStorage.setItem('userConnect', JSON.stringify(result));
                let storage = JSON.parse(localStorage.getItem('userConnect'));
                if (storage.token === undefined) {
                    Auth.setAuth(false)
                    alert("Utilisateur non identifié. Réessayez !")
                } else {
                    Auth.setAuth(true)
                    Cookies.set("user", "loginTrue")
                }
            },
            (error) => {
                if(error) {
                    setError(error);
                    Auth.setAuth(false)
                }
            }
        )
    }, [Auth])

    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    <h1>Connectez-vous</h1>
                    <FormWithContext onSubmit={handleSubmit} >
                        <FormField name="email" type="text">Email</FormField>
                        <FormField name="password" type="password">Mot de passe</FormField>
                        <PrimaryButton>Se connecter</PrimaryButton>
                    </FormWithContext>
                </div>
            </React.Fragment>
        );
    } 
}

export default Login;