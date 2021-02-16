import React from "react";
import styles from "./styles.module.css";
import SpinnerLight from "../spinnerLight/SpinnerLight";

function ButtonFilled({ textContent, disabled, thin, onClick, pending }) {
    // spinnerColor options: light
    return (
        <button
            onClick={onClick}
            disabled={disabled && true}
            className={`${styles.button} ${thin && styles.thin}`}
        >
            {pending ? <SpinnerLight /> : null}
            {pending ? null : textContent}
        </button>
    );
}

export default ButtonFilled;
