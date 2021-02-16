import React from "react";
import styles from "./clickableIcon.module.css";

function ClickableIcon({ icon, color, onClick }) {
    return (
        <div onClick={onClick} className={styles.container} style={{ color: `${color}` }}>
            <div className={styles.inner}>{icon}</div>
        </div>
    );
}

export default ClickableIcon;
