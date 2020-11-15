import React from 'react';
import styles from './styles.module.css';
import UploadElement from '../uploadElement';
import ShowMoreButton from '../showMoreButton';

export default function Uploader(props) {
    return (
        <div className={styles.uploader}>
            <div className={styles.header}>
                <p>Uploads</p>
                <ShowMoreButton light />
            </div>
            {props.files.length > 0 &&
                <div className={styles.filesContainer}>
                    {props.files.map(item => (
                        <UploadElement
                            key={item.uuid}
                            progress={props.progressObject[item.uuid]}
                            file={item.file}
                            xhr={item.xhr} />
                    ))}
                </div>
            }
        </div>
    );
}