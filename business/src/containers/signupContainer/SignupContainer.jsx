import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import Input from "../../components/input/Input";
import styles from "./styles.module.css";
import firebase from "../../lib/firebase";

export default function SignupContainer(props) {
    // Track input values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((u) => {
                //firebase.auth().ver
            })
            .catch((error) => {
                window.alert(error.message);
            });
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} className={styles.container}>
            <h1 className={styles.title}>Create Account</h1>
            <div style={{ marginBottom: "25px" }}>
                <Input
                    grey
                    onChange={(text) => setEmail(text)}
                    required
                    type="email"
                    label="Business Email"
                    placeholder="Business Email"
                />
                <Input
                    grey
                    onChange={(text) => setPassword(text)}
                    required
                    type="password"
                    label="Password"
                    placeholder="Your Password"
                />
            </div>
            <ButtonFilled
                bold
                disabled={email !== "" && password !== "" ? false : true}
                textContent="Create Account"
            />
            <Link
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                    color: "var(--blue)",
                }}
                to={"/"}
            >
                Login
            </Link>
        </form>
    );
}
