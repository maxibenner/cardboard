//import React, { useContext, useState } from 'react';
import styles from './styles.module.css';
import FileCard from '../../components/fileCard';

export default function BrowseContainer({ clips, groups }) {

    return (
        <div className={styles.container}>

            {/*{groups.map(group => (
                <FileCard key={group.name} title={group} isGroup={true}/>
            ))
            }*/}
            {clips.map(clip => (!clip.group &&
                <FileCard key={clip.docId} title={clip.title} />
            ))
            }
            
        </div>
    );
}