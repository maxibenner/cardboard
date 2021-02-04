import React, { useState } from 'react';
import styles from './styles.module.css';

export default function ButtonExpand(props) {

    const [ down, setDown ] = useState(true)

    const classes = `${styles.button} ${props.small && styles.button_small} ${props.light && styles.button_light} ${down?null:styles.button_up}`
    
    const toggleButtonStatus = () => setDown(bool => !bool);

    const handleClick = () => {
        toggleButtonStatus()
        props.onClick()
    }

    return (
        <div onClick={handleClick} className={classes}>
            <span></span>
        </div>
    );
}