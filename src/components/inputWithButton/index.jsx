import React from 'react';
import Button from '../button';
import styles from './styles.module.css';

export default function Input(props) {
    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                placeholder={props.placeholder}
                type={props.type}
                ref={props.passRef}
                onChange={(event) => props.onChange(event.target.value)}
            />
            <div className={styles.buttonWrapper}>
                <Button blue text={'Add'} type={'submit'} />
            </div>

        </div>
    )
}