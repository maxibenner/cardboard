import React from 'react';
import styles from './styles.module.css';
import ButtonCancel from '../buttonCancel';
import ProgressBar from '../progressBar';

export default function UploadElement(props) {
    return (
        <div className={styles.uploadElement}>
            <p className={styles.fileName}>{props.file.name}</p>
            <div className={styles.interactiveContainer}>
                <ProgressBar progress={props.progress}/>
                <ButtonCancel small onClick={()=>props.xhr.abort()}/>
            </div>
        </div>
    );

}