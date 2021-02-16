import React from "react";
import styles from "./card.module.css";

function Card({ inactive, children }) {
    return (
        <div className={`${styles.container} ${inactive && styles.inactive}`}>
            {children}
        </div>
    );
}

export default Card;
