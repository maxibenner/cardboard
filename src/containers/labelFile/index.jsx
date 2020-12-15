import React, { useState } from 'react';
import styles from './styles.module.css';
import Input from '../../components/input';
import Button from '../../components/button';
import Tag from '../../components/tag';

export default function LabelFile(props) {

    const [input, setInput] = useState(null)

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.tagContainer}>
                    {props.file.tags && props.file.tags.map((tag) => {
                        return <Tag title={tag} />
                    })}
                </div>
                <div className={styles.inputContainer}>
                    <Input />
                    <Button blue text={'Add'} input />
                </div>

            </div>
            <div className={styles.background} onClick={() => props.handleModal(null)} />
        </div>
    );
}