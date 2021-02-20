import React from "react";
import styles from "./tag.module.css";

function Tag({textContent, color, style}) {
    return <div style={style} className={styles.container}>{textContent}</div>;
}

export default Tag;
