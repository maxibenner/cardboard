import React from "react";
import styles from "./styles.module.css";

function ButtonFilled({ textContent, disabled, thin }) {
    return (
        <button disabled={disabled && true} className={`${styles.button} ${thin && styles.thin}`}>
            {textContent}
        </button>
    );
}

export default ButtonFilled;
