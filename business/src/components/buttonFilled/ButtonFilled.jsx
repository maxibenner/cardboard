import React from "react";
import styles from "./styles.module.css";

function ButtonFilled({ textContent, disabled, thin, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled && true}
            className={`${styles.button} ${thin && styles.thin}`}
        >
            {textContent}
        </button>
    );
}

export default ButtonFilled;
