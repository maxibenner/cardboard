import React, { useEffect, useState, useRef } from "react";
import styles from './styles.module.css';

// Keep track of confirmation interval
var interval = null;

export default function ButtonLightConfirm(props) {

    const [confirmStatus, setConfirmStatus] = useState(0)
    const [confirmStartTime, setConfirmStartTime] = useState(false)
    const [confirmInProgress, setConfirmInProgress] = useState(false)
    const timeToConfirm = 1500



    const classes = `${styles.container
        } ${props.danger && styles.danger
        } ${props.attention && styles.attention
        }`

    const hiderClasses = `${styles.hider
        } ${confirmInProgress && styles.hider_active}`


    const confirmStart = () => {
        console.log('confirmation started')

        // Prevent dragging of card
        props.preventDrag()

        // Set confirm start time
        setConfirmStartTime(Date.now())

        // Set in progress to true
        setConfirmInProgress(true)

        // Start interval
        interval = setInterval(function () {
            setConfirmStatus(Date.now())
        }, 100);
    }
    const confirmEnd = () => {

        // Re-enable dragging of card
        props.enableDrag()

        // Set in progress to false
        setConfirmInProgress(false)

        console.log('confirmation ended')
        clearInterval(interval)
        setConfirmStatus(0)
    }

    // Moniture confirms tatus
    useEffect(() => {

        // Check if time to confirm has elapsed
        if (confirmStatus >= confirmStartTime + timeToConfirm) {
            console.log('confirmed')
            clearInterval(interval)
            props.confirmAction()
        }

    }, [confirmStatus])




    return (
        <div
            onClick={(e) => props.onClick(e)}
            onMouseDown={confirmStart}
            onMouseUp={confirmEnd}
            onMouseLeave={confirmEnd}
            onTouchStart={confirmStart}
            onTouchEnd={confirmEnd}
            className={classes}
        >
            <div className={hiderClasses}>
                <div className={styles.contentContainerTop}>
                    {props.icon}
                    <p className={styles.title}>
                        {props.title}
                    </p>
                </div>
            </div>

            <div className={styles.contentContainer}>
                {props.icon}
                <p className={styles.title}>
                    {props.title}
                </p>
            </div>

        </div>
    )
}