import React from "react";
import styles from './styles.module.css';

export default function ButtonLight({ title, icons, ...props }) {

    const classes = [
        styles.container,
        styles.noselect,
        props.danger && styles.danger,
        props.attention && styles.attention,
        props.stacked && styles.stacked,
        !props.icon && styles.noIcon,
        props.pointer && styles.pointer,
    ].join(' ')

    const icon = props.icon && props.icon

    return (
        <div
            onClick={props.onClick}
            className={classes}
        >
            {icon}
            <p className={styles.title}>
                {title}
            </p>

        </div>
    )
}