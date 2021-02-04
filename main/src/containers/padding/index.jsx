import React from 'react';
import styles from './styles.module.css';

export default function Padding(props) {

    const classes = `${styles.element} ${props.horizontal && styles.horizontal}`

    return (
        <div className={classes}>
            {props.children}
        </div>
    );
}