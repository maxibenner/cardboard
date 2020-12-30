import React from "react";
import styles from './styles.module.css';

export default function ButtonLight(props) {

    const classes = `${
        styles.container
    } ${
        props.danger && styles.danger
    } ${
        props.attention && styles.attention
    } ${
        props.stacked && styles.stacked
    } ${
        !props.icon && styles.noIcon
    } ${
        props.pointer && styles.pointer
    } ${
        props.large && styles.large
    }`

    return (
        <div
            onClick={props.onClick}
            className={classes}
        >
            {props.icon && props.icon}
            <p className={styles.title}>
                {props.title}
            </p>
            
        </div> 
    )
}