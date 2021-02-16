import React from "react";
import styles from "./styles.module.css";
import SpinnerLight from "../spinnerLight/SpinnerLight";

function ButtonStripe({ disabled, onClick, pending }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled && true}
            className={styles.button}
        >
            {pending ? <SpinnerLight /> : null}
            {pending ? null : <h3 className={styles.text}>Connect with<span></span></h3>}
        </button>
    );
}

export default ButtonStripe;
