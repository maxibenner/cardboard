import React from 'react';
import styles from './styles.module.css';

export default function CancelButton(props) {

    const classes = `${styles.x} ${props.small&&styles.x_small}`
    
    return (
        <div onClick={props.onClick} className={classes}>
            <span></span>
        </div>
    );
}