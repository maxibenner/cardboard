import React, { useState } from 'react';
import styles from './styles.module.css';
import UploadElement from '../uploadElement';
import ShowMoreButton from '../showMoreButton';

export default function Uploader(props) {

    const [open, setOpen] = useState(true)

    function minimize(){
        setOpen(state => !state)
    } 

    return (
        <div className={styles.uploader}>
            <div className={styles.header}>
                <p>Uploads</p>
                <ShowMoreButton light onClick={minimize}/>
            </div>
            {props.files.length > 0 && open &&
                <div className={styles.filesContainer}>
                    {props.files.map(item => (
                        <UploadElement
                            key={item.uuid}
                            progress={item.progress}
                            file={item.file}
                            xhr={item.xhr} />
                    ))}
                </div>
            }
        </div>
    );
}