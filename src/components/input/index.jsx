import React from 'react';
import styles from './styles.module.css';

export default function Input(props) {
    return (
        <>
            <input
                className={styles.input}
                placeholder={props.placeholder}
                type={props.type}
                ref={props.passRef}
                onChange={(event) => props.onChange(event.target.value)}
            />
            <p className={styles.label}>{props.label}</p>
        </>
    )
}