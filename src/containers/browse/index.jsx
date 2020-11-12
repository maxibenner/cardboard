import React from 'react';
import styles from './styles.module.css';
import FileCard from '../../components/fileCard';

export default function BrowseContainer({ clips }) {
    return (
        <div className={styles.container}>
            <FileCard title="Group" isGroup={true}/>
            <FileCard title="Tape" />
            <FileCard title="Unnamed" />
        </div>
    );
}