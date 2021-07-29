import React, {useEffect,useState} from 'react';
import { Redirect, Link } from 'react-router-dom';
import FormField from '../FormField';
import Form from 'react-bootstrap/Form';
import styles from './UpdateAccount.module.scss';

export default function UpdateAccount() {
	const [redirection, setRedirection] = useState(false);
	const [userAccount, setUserAccount] = useState(null);
	const [userConnect, setUserConnect] = useState(null);
	const [error, setError] = useState(null);
	const [state, setState] = useState({});

	useEffect(() => {
		setUserAccount(JSON.parse(localStorage.getItem('userAccount')));
		setUserConnect(JSON.parse(localStorage.getItem('userConnect')));
	}, []);
	

	useEffect(() => {
		setState({
			firstname: userAccount.firstname,
			lastname: userAccount.lastname,
			bio: userAccount.bio || '',
		});
	}, [userAccount]);

	
	useEffect(() => {
		setState({
			...state,
			userId: userConnect.userId,
			isAdmin: userConnect.userAdmin,
		});
	}, [userConnect]);

	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;

		setState({
			[name]: value,
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		const storage = JSON.parse(localStorage.getItem('userConnect'));
		const userId = storage.userId;
		let token = 'Bearer ' + storage.token;

		const requestOptions = {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: token,
			},
			body: JSON.stringify(state),
		};

		fetch('http://localhost:8080/api/users/' + userId, requestOptions)
			.then((response) => response.json())
			.then((response) => {
				if (response.error) {
					alert("Votre compte n'a pas été modifié : " + response.error);
				} else {
					setRedirection(true);
				}
			})
			.catch((error) => {
				// this.setState({ Erreur: error.toString() });
				setError(error.toString());
				console.error('Error', error);
			});
	}

	const userId = userAccount ? userAccount.id : false;

	if (userId && redirection) {
		return <Redirect to={'/user/' + userId} />;
	}

	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.title}>Modifier votre profil</h1>
				<form className={styles.form}>
					<FormField
						name="firstname"
						value={state.firstname}
						onChange={handleChange}
					>
						Prénom
					</FormField>
					<FormField
						name="lastname"
						value={state.lastname}
						onChange={handleChange}
					>
						Nom
					</FormField>
					<Form.Group
						className={styles.group}
						controlId="exampleForm.ControlTextarea1"
					>
						<Form.Label>Rédigez une bio</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							name="bio"
							value={state.bio}
							onChange={handleChange}
						/>
					</Form.Group>
					<div className={styles.submit}>
						<button className={styles.btn} onClick={handleSubmit}>
							Enregistrer
						</button>
						<Link to={'/user/' + userId} className={styles.btn}>
							Annuler
						</Link>
					</div>
				</form>
			</div>
		</>
	);
}
