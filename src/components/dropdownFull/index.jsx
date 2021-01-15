import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';


export default function DropdownFull(props) {

    const [active, setActive] = useState(false)

    //Set click listener
    useEffect(() => {

        if (active === false) return

        // Add outside click listener
        active && document.addEventListener('click', closeMenu);

        return () => {
            document.removeEventListener('click', closeMenu);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])

    // Open and close dropdown
    const closeMenu = () => {
        setActive(false)
    }

    return (
        <div className={styles.containerInner}>
            <div className={styles.icon} onClick={() => setActive(true)}>
                {props.icon}
            </div>
            {active === true &&
                <div className={`${styles.container} ${props.down && styles.down}`}>
                    {props.children}
                </div>
            }

        </div>
    );
}