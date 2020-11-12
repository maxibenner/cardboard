import React from "react";
import styles from "./styles.module.css";

export default function Button(props) {
    return (
        <button type={props.type} disabled={props.disabled} className={styles.container}>
            <div className={styles.top}>
                <p className={styles.text}>{props.text}</p>
            </div>
            <div className={styles.bottom}></div>
        </button>
    );
}


