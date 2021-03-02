import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { FirebaseContext } from "../src/context/firebase";
import * as ROUTES from "../src/constants/routes";
import Navbar from "../src/components/navbar";
import Button from "../src/components/button";
import Input from "../components/input";
import styles from "./signup.module.css";

export default function Signup() {
	const history = useHistory();
	const { firebase } = useContext(FirebaseContext);
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const allowSignup = false;

	const handleSignup = (event) => {
		event.preventDefault();

		if (allowSignup === true) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(emailAddress, password)
				.then(() => {
					history.push(ROUTES.LIBRARY);
				})
				.catch((error) => {
					setError(error.message);
				});
		} else {
			window.alert("We currently do not accept new sign ups. Come back soon!");
		}
	};

	return (
		<div className={styles.base}>
			<Navbar noauth relative yellow to={ROUTES.LANDING} />
			<div className={styles.wrapper}>
				<form onSubmit={handleSignup} className={styles.form}>
					<h1 className={styles.title}>Sign Up</h1>
					{error && <p className={styles.err}>{error}</p>}
					<Input
						placeholder="Your Email"
						label="Email*"
						value={emailAddress}
						onChange={(value) => setEmailAddress(value)}
					/>
					<Input
						placeholder="Your Password"
						type="password"
						label="Password*"
						value={password}
						onChange={(value) => setPassword(value)}
					/>
					<Button large red type="submit" text="Sign Up" />
					<p>
						Already have an account?{" "}
						<Link to={ROUTES.SIGN_IN} className={styles.bold}>
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
