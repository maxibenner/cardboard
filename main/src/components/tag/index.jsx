import React from 'react'
import styles from './styles.module.css';
import ButtonCancel from '../buttonCancel';

export default function Tag(props) {
    return (
        <div className={styles.container}>
            <ButtonCancel light small onClick={()=>props.onCancel(props.title)} />
            <p>{props.title}</p>
        </div>
    )
}
