import React from "react";
import styles from "./styles.module.css";

function SpinnerLight({style}) {
    return (
        <div>
            <div className={styles.spinnerBorder}>
                <span className={styles.srOnly}>Loading...</span>
            </div>
        </div>
    );
}

export default SpinnerLight;
