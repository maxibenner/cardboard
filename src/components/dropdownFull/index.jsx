import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import useClickOutside from '../../helpers/clickOutside';


export default function DropdownFull(props) {

    const [active, setActive] = useState(null)
    const { ref, isVisible, setIsVisible } = useClickOutside(false);

    const toggle = useRef()

    const classes =
        `
        ${styles.container}
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
        if (props.parentAction) props.parentAction(true)
        calculateDirection()
        setIsVisible(true)
    }

    // Update parent z on active
    useEffect(() => {

        if (props.parentAction) {

            if (!isVisible) props.parentAction(false)

        }

    }, [isVisible])



    return (
        <div ref={toggle}>
            <div className={styles.containerInner}>
                <div onClick={toggleActive}>
                    {props.icon}
                </div>
                {isVisible &&
                    <div className={classes} ref={ref}>
                        {props.children}
                    </div>
                }

            </div>

        </div>
    );
}