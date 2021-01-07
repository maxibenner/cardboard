import React, { useState, useCallback } from "react";
import styles from "./styles.module.css";
//import { RiScissorsFill } from 'react-icons/ri';
import { FaVideo } from 'react-icons/fa';
import { MdImage,/* MdAudiotrack, */MdPlayCircleFilled } from 'react-icons/md';


export default function CardFileStatic(props) {

    //Input state
    const [title, setTitle] = useState(props.file.name)


    // Handle active media
    const handleActiveMedia = useCallback(
        (type) => props.handleActiveMedia(props.file, type), [props],
    )




    return (
        <div className={styles.card} >
            <div className={styles.cardInner}>
                <div className={styles.videoContainer} onClick={() => handleActiveMedia('show')}>
                    {!props.file.thumbnail_url && props.file.type === 'image' &&
                        <MdImage className={styles.processingButton} />
                    }
                    {!props.file.thumbnail_url && props.file.type === 'video' &&
                        <FaVideo className={styles.processingButton} />
                    }
                    {props.file.thumbnail_url && props.file.type === 'video' &&
                        <MdPlayCircleFilled className={styles.playButton} />
                    }
                    <div className={styles.image} style={props.file.thumbnail_url && { backgroundImage: `url(${props.file.thumbnail_url})` }}></div>
                </div>

                <div className={styles.body}>
                    <div className={styles.main}>
                        <p className={styles.title}>{title}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}



