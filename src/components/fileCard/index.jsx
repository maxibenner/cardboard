import React from "react";
import styles from "./styles.module.css";
import ContextMenu from '../contextMenu';
import folderIcon from '../../media/icons/icon--folder_dark.svg';

export default function FileCard(props) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <div className={styles.image}></div>
            </div>

                <div className={styles.body}>
                    <div className={styles.main}>
                        {props.isGroup && <img className={styles.icon} src={folderIcon} alt='FolderIcon' />}
                        <p className={styles.title}>{props.title}</p>
                    </div>
                    <ContextMenu />
                </div>
       
        </div>
    );
}


