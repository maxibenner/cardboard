import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FirebaseContext } from '../context/firebase';
import * as ROUTES from '../constants/routes';
import Navbar from '../components/navbar';
import Button from '../components/button';
import Input from '../components/input';
import styles from "./signin.module.css";

export default function Signin() {

    const history = useHistory();
    const { firebase } = useContext(FirebaseContext);
    
    const [emailAddress, setEmailAddress] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const handleSignin = (event) => {
        event.preventDefault();
        
        firebase
            .auth()
            .signInWithEmailAndPassword(emailAddress, password)
            .then(() => {
                history.push(ROUTES.LIBRARY)
            })
            .catch((error) => {
                setError(error.message);
            })
    }

    return (
        <div className={styles.base}>
            <Navbar noauth relative yellow to={ROUTES.LANDING}/>
            <div className={styles.wrapper}>
                <form onSubmit={handleSignin} className={styles.form}>
                    <h1 className={styles.title}>Login</h1>
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
                    <Button large red type="submit" text="Sign In" />
                    <p>Don't have an account, yet? <Link to={ROUTES.SIGN_UP} className={styles.bold}>Sign up</Link></p>
                </form>
            </div>

        </div>
    )
}