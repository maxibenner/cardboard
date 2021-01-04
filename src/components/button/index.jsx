import React from "react";
import styles from "./styles.module.css";

export default function Button(props) {

    const classes = [
        styles.container,
        props.large && styles.container_large,
        props.fitText && styles.container_fitText,
        props.wide && styles.container_wide,
        props.input && styles.container_input,
        props.absolute && styles.container_absolute,
    ].join(" ");

    const classes2 = [
        props.red && styles.container_red,
        props.blue && styles.container_blue,
        props.yellow && styles.container_yellow,
        props.dark && styles.container_dark
    ].join(" ");

    return (
        <button onClick={props.onClick} type={props.type} disabled={props.disabled} className={classes} >
            <div className={styles.backgroundForOpacity} />
            <div className={classes2}>
                <p className={styles.text}>{props.text}</p>
            </div>
        </button>
    );
}


