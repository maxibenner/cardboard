import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';


export default function DropdownFull(props) {

    const [direction, setDirection] = useState(null)

    const toggle = useRef()

    const classes =
        `
        ${styles.container}
        ${direction === 'up' && styles.up}
        ${/*To prevent flicker of parent z-index change*/direction && styles.z}
        `

    // Calculate dropdown direction and set close click event listener
    const toggleMenu = () => {

        // Set parend z index to top
        if (props.parentAction) {

            if (direction) props.parentAction(true)
            else props.parentAction(false)

        }

        if (!direction) {

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

    }

    //Set click listener
    useEffect(()=>{

        if(direction === null) return
        
        // Add outside click listener
        direction && console.log('tesgisterd')
        direction && document.addEventListener('click', toggleActive);

        return () => {
            document.removeEventListener('click', toggleActive);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[direction])


    // Open and close dropdown
    const toggleActive = () => {
        if(direction === null) toggleMenu()
        else setDirection(null)
    }


    return (
        <div ref={toggle}>
            <div className={styles.containerInner}>
                <div onClick={toggleActive}>
                    {props.icon}
                </div>
                {direction &&
                    <div className={classes}>
                        {props.children}
                    </div>
                }

            </div>

        </div>
    );
}