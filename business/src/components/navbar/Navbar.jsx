import React from "react";
import UserButton from "../userButton/UserButton";
import styles from "./styles.module.css";
import firebase from "firebase";

function Navbar(props) {
    return (
        <div className={styles.navbar}>
            <img
                className={styles.img}
                src="/logo.svg"
                alt="logo"
                onClick={() => firebase.auth().signOut()}
            />
            <UserButton />
        </div>
    );
}

export default Navbar;
