import React, { useState } from 'react';
import styles from './styles.module.css';

export default function ShowMoreButton(props) {

    const [ down, setDown ] = useState(true)

    const classes = `${styles.button} ${props.small && styles.button_small} ${props.light && styles.button_light} ${down?null:styles.button_up}`
    
    const toggleButtonStatus = () => setDown(bool => !bool);

    return (
        <div onClick={toggleButtonStatus} className={classes}>
            <span></span>
        </div>
    );
}