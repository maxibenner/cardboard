import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FirebaseContext } from '../context/firebase';
import * as ROUTES from '../constants/routes';
import NavbarLanding from '../components/navbarLanding';
import Button from '../components/button';
import Input from '../components/input';
import styles from "./signup.module.css";

export default function Signup() {

    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (event) => {
        event.preventDefault();

        window.alert('We currently do not accept new sign ups. Come back soon!')
        
        /*firebase
            .auth()
            .createUserWithEmailAndPassword(emailAddress, password)
            .then(() => {
                history.push(ROUTES.LIBRARY)
            })
            .catch((error) => {
                setEmailAddress('');
                setPassword('');
                setError(error.message);
            })
            */
    }

    return (
        <div className={styles.base}>
            <NavbarLanding yellow to={ROUTES.LANDING}/>
            <div className={styles.wrapper}>
                <form onSubmit={handleSignup} className={styles.form}>
                    <h1 className={styles.title}>Sign Up</h1>
                    {error && <p className={styles.err}>{error}</p>}
                    <Input
                        placeholder="Your Email"
                        label="Email*"
                        value={emailAddress}
                        onChange={value => setEmailAddress(value)} />
                    <Input
                        placeholder="Your Password"
                        type="password"
                        label="Password*" value={password}
                        onChange={value => setPassword(value)} />
                    <Button large red type="submit" text="Sign Up" />
                    <p>Already have an account? <Link to={ROUTES.SIGN_IN}>Sign in</Link></p>
                </form>
            </div>

        </div>
    )
}