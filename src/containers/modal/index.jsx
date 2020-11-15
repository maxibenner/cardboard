import React from 'react';
import styles from './styles.module.css';
import CancelButton from '../../components/cancelButton';

export default function Modal(props) {

    if (!props.show) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <CancelButton onClick={props.onCancel} />
            <div className={styles.container}>
                <p className={styles.title}>{props.title}</p>
                <p className={styles.sub}>{props.sub}</p>
                {props.children}
            </div>
        </div >
    );
}