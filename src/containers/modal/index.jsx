import React, { useState } from 'react';
import styles from './styles.module.css';

export default function Modal(props) {

    if (!props.show) {
        return null;
    }

    return (
        <div className={styles.modal} >
            { props.children }
        </div >
    );
}