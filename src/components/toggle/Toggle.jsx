import React from 'react'
import styles from './styles.module.css'

export default function Toggle(props) {

    const classes = [
        styles.container,
        (props.active) && styles.active
    ].join(" ");

    const handleClick = _ => props.onClick()

    return (
        <div className={classes} onClick={handleClick}>
            <div />
        </div>
    )
}

