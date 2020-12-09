import React from 'react';
import styles from './styles.module.css';

export default function ButtonCancel(props) {

    const classes = `${styles.x
        } ${props.small && styles.x_small
        } ${props.light && styles.x_light
        }`

    return (
        <div onClick={props.onClick} className={classes}>
            <span></span>
        </div>
    );
}