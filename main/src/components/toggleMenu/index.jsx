import React from 'react';
import styles from './styles.module.css';

export default function ToggleMenu(props) {

    const classes = `${styles.container} ${props.active && styles.container_active}`

    return (
        <div className={classes} onClick={props.onClick}>
            <div>
                {props.children}
            </div>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
} 