import React from "react";
import styles from "./styles.module.css";
import SpinnerLight from "../spinnerLight/SpinnerLight";

function ButtonFilled({ textContent, disabled, thin, bold, onClick, pending, style }) {
    // spinnerColor options: light
    return (
        <button
            style={style}
            onClick={onClick}
            disabled={disabled && true}
            className={`${styles.button} ${thin && styles.thin} ${bold && styles.bold}`}
        >
            {pending ? <SpinnerLight /> : null}
            {pending ? null : textContent}
        </button>
    );
}

export default ButtonFilled;
