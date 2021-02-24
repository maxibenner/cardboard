import React from "react";
import styles from "./styles.module.css";

export default function ButtonLight({ title, notification, ...props }) {
    const classes = [
        styles.container,
        styles.noselect,
        props.danger && styles.danger,
        props.red && styles.red,
        props.attention && styles.attention,
        props.stacked && styles.stacked,
        !props.icon && styles.noIcon,
        props.pointer && styles.pointer,
    ].join(" ");

    const icon = props.icon && props.icon;

    return (
        <div onClick={!props.red ? props.onClick : null} className={classes} style={props.style}>
            {icon}
            <p onClick={props.red ? props.onClick : null} style={{ margin: 0 }} className={title && props.icon && styles.title}>
                {title}
            </p>
            {notification && (
                <div className={styles.notification}>{notification}</div>
            )}
        </div>
    );
}
