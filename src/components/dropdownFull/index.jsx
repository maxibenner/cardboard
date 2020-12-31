import React, { useState, useRef, useCallback } from 'react';
import styles from './styles.module.css';


export default function DropdownFull(props) {

    const [active, setActive] = useState(null)

    const toggle = useRef()

    const classes =
        `
        ${styles.container}
        ${!active && styles.closed}
        ${active === 'up' && styles.up}
        `

    // Show dropdown on top or below, depending on available space 
    const calculateDirection = useCallback(() => {

        // Get window height
        const windowHeight = window.innerHeight

        // Get position of dropdown toggle
        const toggleCenter = toggle.current.getBoundingClientRect().top - (toggle.current.offsetHeight / 2)

        // Choose which direction to go
        if (toggleCenter < windowHeight / 2.5) {
            setActive('down')
        } else {
            setActive('up')
        }

    }, [])

    // Open and close dropdown
    const toggleActive = () => {
        calculateDirection()
    }


    return (
        <div ref={toggle}>
            <div className={styles.containerInner}>
                <div onClick={toggleActive}>
                    {props.icon}
                </div>
                {
                    active && <div className={styles.background} onClick={() => setActive(null)} />
                }
                <div className={classes}>
                    {props.children}
                </div>
            </div>


        </div>
    );
}