import React from "react";
import styles from "./buttonGhost.module.css";

function ButtonGhost({ textContent, disabled, thin, bold, onClick, style }) {
    // spinnerColor options: light
    return (
        <button
            style={style}
            onClick={onClick}
            disabled={disabled && true}
            className={`${styles.button} ${thin && styles.thin} ${bold && styles.bold}`}
        >
            {textContent}
        </button>
    );
}

export default ButtonGhost;
