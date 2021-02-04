import React from 'react';
import styles from './styles.module.css';

export default function ProgressBar(props) {

    return (
        <div className={styles.container}>
            <div className={styles.bar} style={{ width: props.progress + '%' }}></div>
        </div>
    );
}