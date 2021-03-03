import React from "react";
import styles from "./gradientPH.module.css";

function GradientPH(props) {
    return (
        <div className={styles.animatedBackground}>
            <div className={styles.header_split} />
            <div className={styles.spacer_title} />
            <div className={styles.body_100} />
            <div className={styles.spacer_body} />
            <div className={styles.body_40} />
            <div className={styles.spacer_title} />
            <div className={styles.body_30} />
            
        </div>
    );
}

export default GradientPH;
