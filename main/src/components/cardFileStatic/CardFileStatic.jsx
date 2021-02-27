import React, { useCallback } from "react";
import styles from "./styles.module.css";
import { firebase } from "../../lib/firebase";
//import { RiScissorsFill } from 'react-icons/ri';
import { FaVideo } from "react-icons/fa";
import {
    MdImage,
    MdFileDownload,
    /* MdAudiotrack, */ MdPlayCircleFilled,
} from "react-icons/md";
import DropdownFull from "../dropdownFull/index";
import ToggleContext from "../toggleContext/index";
import ButtonLight from "../buttonLight/index";

export default function CardFileStatic(props) {
    // Handle active media
    const handleActiveMedia = useCallback(
        (type) => props.handleActiveMedia(props.file, type),
        [props]
    );

    // Downlaods
    const handleSingleFileDownload = async () => {
        var downloadLink = document.createElement("a");

        // Get download url with filename
        const url = await firebase
            .functions()
            .httpsCallable("sign_wasabi_download_url")(props.file);
        downloadLink.setAttribute("href", url.data);
        downloadLink.setAttribute("download", `${props.file.name}.${props.file.suffix}`);
        downloadLink.click();
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardInner}>
                <div
                    className={styles.videoContainer}
                    onClick={() => handleActiveMedia("show")}
                >
                    {!props.file.thumbnail_url &&
                        props.file.type === "image" && (
                            <MdImage className={styles.processingButton} />
                        )}
                    {!props.file.thumbnail_url &&
                        props.file.type === "video" && (
                            <FaVideo className={styles.processingButton} />
                        )}
                    {props.file.thumbnail_url &&
                        props.file.type === "video" && (
                            <MdPlayCircleFilled className={styles.playButton} />
                        )}
                    <div
                        className={styles.image}
                        style={
                            props.file.thumbnail_url && {
                                backgroundImage: `url(${props.file.thumbnail_url})`,
                            }
                        }
                    ></div>
                </div>

                <div className={styles.body}>
                    <div className={styles.main}>
                        <p className={styles.title}>{props.file.name}</p>
                    </div>
                    <DropdownFull down icon={<ToggleContext />}>
                        <ButtonLight
                            title={"Download"}
                            icon={<MdFileDownload />}
                            onClick={handleSingleFileDownload}
                        />
                    </DropdownFull>
                </div>
            </div>
        </div>
    );
}
