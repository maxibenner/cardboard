import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';


export default function DropdownFull(props) {

    const [active, setActive] = useState(false)
    const [direction, setDirection] = useState(null)

    const toggle = useRef()

    const classes =
        `
        ${styles.container}
        ${direction === 'up' && styles.up}
        ${/*To prevent flicker of parent z-index change*/active === true && styles.z}
        `

    // Calculate dropdown direction and set close click event listener
    useEffect(() => {

        // Set parend z index to top
        if (props.parentAction) {

            if (active) props.parentAction(true)
            else props.parentAction(false)

        }

        if (active !== false) {

            // Get window height
            const windowHeight = window.innerHeight

            // Get position of dropdown toggle
            const toggleCenter = toggle.current.getBoundingClientRect().top - (toggle.current.offsetHeight / 2)

            // Choose which direction to go
            if (toggleCenter < windowHeight / 2.5) {
                setDirection('down')
            } else {
                setDirection('up')
            }
        }

        // Add outside click listener
        active === true && document.addEventListener('click', toggleActive);

        return () => {
            document.removeEventListener('click', toggleActive);
        };

    }, [active])


    // Open and close dropdown
    const toggleActive = () => {
        setActive(status => !status)
    }

    // Open and close dropdown
    const toggleInitialActive = () => {
        if (active === true) return
        setActive(true)
    }



    return (
        <div ref={toggle}>
            <div className={styles.containerInner}>
                <div onClick={toggleInitialActive}>
                    {props.icon}
                </div>
                {active !== false &&
                    <div className={classes}>
                        {props.children}
                    </div>
                }

            </div>

        </div>
    );
}