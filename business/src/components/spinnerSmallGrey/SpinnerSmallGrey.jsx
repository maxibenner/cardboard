import React from "react";
import styles from "./spinnerSmallGrey.module.css";

function SpinnerSmallGrey({ style }) {
    return (
        <div style={style}>
            <div className={styles.spinnerBorder}>
                <span className={styles.srOnly}>Loading...</span>
            </div>
        </div>
    );
}

export default SpinnerSmallGrey;
