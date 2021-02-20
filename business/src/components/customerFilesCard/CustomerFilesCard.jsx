import React from "react";
import styles from "./customerFilesCard.module.css";
import { timestamp_to_date, prettier_size } from "../../helpers/tools";

export default function CustomerFilesCard({ file }) {
    return (
        <div className={styles.card}>
            <div className={styles.thumbnail_container}>
                <img src={file.thumbnail_url} alt="thumbnail" />
            </div>
            <p className={styles.name}>{file.name}</p>
            <p className={styles.size}>{prettier_size(file.size / 1000000)}</p>
            <p className={styles.date}>{timestamp_to_date(file.created)}</p>

            {/*<div className={styles.cardInner}>
                <div className={styles.videoContainer} onClick={() => handleActiveMedia('show')}>
                    <div className={styles.image} style={props.file.thumbnail_url && { backgroundImage: `url(${props.file.thumbnail_url})` }}></div>
                </div>

                <div className={styles.body}>
                    <div className={styles.main}>
                        <p className={styles.title}>{props.file.name}</p>
                    </div>
                </div>
    </div>*/}
        </div>
    );
}
