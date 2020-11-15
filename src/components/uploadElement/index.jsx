import React from 'react';
import styles from './styles.module.css';
import CancelButton from '../cancelButton';
import ProgressBar from '../progressBar';

export default function UploadElement(props) {

    return (
        <div className={styles.uploadElement}>
            <p className={styles.fileName}>{props.file.name}</p>
            <div className={styles.interactiveContainer}>
                <ProgressBar progress={props.progress}/>
                <CancelButton small onClick={()=>props.xhr.abort()}/>
            </div>
        </div>
    );

}