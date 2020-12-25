import React from 'react';
import styles from './styles.module.css';
import ButtonCancel from '../buttonCancel';
import ProgressBar from '../progressBar';

export default function UploadElement(props) {

    const classes = `${styles.uploadElement} ${!props.active && styles.inactive}`

    return (
        <div className={classes}>
            <p className={styles.fileName}>{props.name}</p>
            <div className={styles.interactiveContainer}>
                <ProgressBar progress={props.progress} />
                <ButtonCancel small onClick={() => props.xhr.abort()} />
            </div>
        </div>
    );

}