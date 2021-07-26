import React from 'react';
import styles from "./Posts/CreatePost.module.scss"


const Form = ({name, type, value, onChange, children}) => {
    return <div className={styles.group}>
        <label htmlFor={name}>{children}</label>
        <input type={type} value={value} onChange={onChange} id={name} name={name} className="form-control" noValidate/>
    </div>
}

export default Form;