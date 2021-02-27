import React from "react";
import styles from "./tag.module.css";

function Tag({textContent, variant, style}) {
    return <div style={style} className={`${styles.container} ${variant==="pending" && styles.pending}`}>{textContent}</div>;
}

export default Tag;
