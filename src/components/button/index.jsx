import React from "react";
import styles from "./styles.module.css";

export default function Button(props) {

    const classes = `
                    ${styles.container} 
                    ${props.large ? styles.container_large : styles.container_normal}
                    ${props.red && styles.container_red}
                    ${props.blue && styles.container_blue}
                    `

    return (
        <button onClick={props.onClick} type={props.type} disabled={props.disabled} className={classes} >
            <div>
                <p className={styles.text}>{props.text}</p>
            </div>
            <div></div>
        </button>
    );
}


