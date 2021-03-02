import React from "react";
import styles from "./hint.module.css";
import { AiFillQuestionCircle } from "react-icons/ai";

function Hint({ textContent }) {
    return (
        <div className={styles.container}>
            <AiFillQuestionCircle />
            <div className={styles.text}>{textContent}</div>
        </div>
    );
}

export default Hint;
