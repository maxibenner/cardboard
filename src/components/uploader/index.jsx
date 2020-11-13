import React, { useState } from 'react';
import styles from './styles.module.css';

export default function Uploader(){

    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState({})
    const [uploadSuccess, setUploadSuccess] = useState(false)

    return (
        <>
            <div className={styles.header}>
                <p>Uploads</p>
                <div>minimize</div>
            </div>
            <div className={styles.filesContainer}></div>
        </>
    );
}