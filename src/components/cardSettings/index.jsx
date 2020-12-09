import React from 'react';
import styles from './styles.module.css';
import { MdEdit } from 'react-icons/md';

export default function CardSettings(props) {

    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <p className={styles.title}>{props.title}</p>
            </div>
            <div className={styles.rightSide}>
                <p className={styles.info}>{props.info}</p>
                <div className={styles.editContainer} onClick={props.onClick}>
                    <MdEdit />
                </div>
                
            </div>
        </div>
    );
}