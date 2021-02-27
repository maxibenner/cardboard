import React, { useEffect } from "react";
import styles from "./styles.module.css";

export default function WatchContainer(props) {

    // Listen for arrow clicks
    useEffect(() => {
        // Handle key
        const handleMediaNavigation = (e) => props.handleWatchKeydown(e.code);

        // Add keydown event listener
        document.addEventListener("keydown", handleMediaNavigation);

        return () => {
            document.removeEventListener("keydown", handleMediaNavigation);
        };
    }, [props]);

    return (
        <>
            {props.activeMedia.type !== false && (
                <div className={styles.container}>
                    {props.activeMedia.type === "image" && (
                        <img
                            className={styles.image}
                            alt={"active view"}
                            src={props.activeMedia.url}
                        />
                    )}
                    {props.activeMedia.type === "video" && (
                        <video
                            controls
                            className={styles.video}
                            alt={"active view"}
                            src={props.activeMedia.url}
                            poster={props.thumbnail_url}
                        ></video>
                    )}
                    <div
                        className={styles.background}
                        onClick={() => props.handleActiveMedia(null)}
                    />
                </div>
            )}
            {!props.activeMedia.type && (
                <div className={styles.container}>
                    <div
                        className={styles.background}
                        onClick={() => props.handleActiveMedia(null)}
                    />
                </div>
            )}
        </>
    );
}
