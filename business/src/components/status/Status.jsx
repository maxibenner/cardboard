import React from "react";
import styles from "./status.module.css";

function Status({ statusObject }) {
    if (statusObject !== undefined) {
        return (
            <div
                className={`${styles.container} ${styles[statusObject.status]}`}
            >
                <div className={styles.statusLight}></div>
                <p className={styles.text}>{statusObject.message}</p>
            </div>
        );
    } else {
        return <div className={styles.placeholder}></div>;
    }
}

export default Status;
