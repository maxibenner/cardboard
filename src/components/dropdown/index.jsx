import React from 'react';
import styles from './styles.module.css';


export default function Dropdown(props) {

    const classes = 
    `${
        styles.container
    } ${
        !props.active && styles.closed
    } ${
        props.top && styles.top
    } ${
        props.small && styles.small
    }`;

    return (
            <div className={classes}>
                {props.children}
            </div>
    );
}