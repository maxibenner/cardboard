import React from "react";
import styles from "./styles.module.css";
import SpinnerLight from "../spinnerLight/SpinnerLight";

function ButtonFilled({
    icon,
    textContent,
    disabled,
    thin,
    bold,
    onClick,
    pending,
    style,
}) {
    // spinnerColor options: light
    return (
        <button
            style={style}
            onClick={onClick}
            disabled={disabled && true}
            className={`${styles.button} ${thin && styles.thin} ${
                bold && styles.bold
            }`}
        >
            {icon && (
                <div style={{ marginRight: "7px", display: "flex" }}>
                    {icon}
                </div>
            )}
            {pending ? <SpinnerLight /> : null}
            {pending ? null : textContent}
        </button>
    );
}

export default ButtonFilled;
