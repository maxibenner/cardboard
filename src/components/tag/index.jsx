import React from 'react'
import styles from './styles.module.css';
import CancelButton from '../cancelButton';

export default function Tag(props) {
    return (
        <div className={styles.container}>
            <CancelButton light small onClick={()=>props.onCancel(props.title)} />
            <p>{props.title}</p>
        </div>
    )
}
