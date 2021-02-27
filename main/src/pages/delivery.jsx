import React, { useState, useEffect } from "react";
import { firebase } from "../lib/firebase";
import styles from "./delivery.module.css";

import WatchContainer from "../containers/watch/WatchContainer";
import Navbar from "../components/navbar";
import CardFileStatic from "../components/cardFileStatic/CardFileStatic";

import emptyIllustration from "../media/illustration-empty.svg";

export default function Share() {
    const [files, setFiles] = useState(null);
    const [cards, setCards] = useState(null);
    const [owner, setOwner] = useState(null);
    const [business, setBusiness] = useState(null);

    const [activeMedia, setActiveMedia] = useState(null);

    // Set active file
    const handleActiveMedia = async (fileObject, action) => {
        // Available actions are: "show" and "label"

        // Show placeholder
        setActiveMedia(() => {
            const ph = {
                type: false,
                action: action,
            };
            return ph;
        });

        // Remove active media if null
        !fileObject && setActiveMedia(null);

        if (action === "show") {
            // Display file

            //Set action
            fileObject.action = "show";

            if (fileObject === null) {
                return setActiveMedia(fileObject);
            } /*else if (fileObject.url) {
                // Only get url if it doesn't exist, yet. -> Maybe dangerous as url expires after 6 hours
                return setActiveMedia(fileObject);
            }*/ else {
                const url = await firebase
                    .functions()
                    .httpsCallable("sign_wasabi_download_url")(fileObject);
                fileObject.url = url.data;
                setActiveMedia(fileObject);
            }
        } else if (action === "label") {
            // Label file

            // Set action
            fileObject.action = "label";

            // Set active media
            setActiveMedia(fileObject);
        }
    };

    // Handle file navigation
    const handleWatchNavigatin = (pressedKey) => {
        // Get new visible index of only files
        const slideShowFiles = files.filter((element) => {
            return element.display_type === "file";
        });

        // Get index of currently active element in visibleFiles array
        const indexOfActiveFile = slideShowFiles.findIndex(
            (file) => file.id === activeMedia.id
        );

        // Previous/Next file
        if (pressedKey === "ArrowRight") {
            // Check if last file
            if (indexOfActiveFile + 1 === slideShowFiles.length) {
                // Back to start
                handleActiveMedia(slideShowFiles[0], "show");
            } else {
                // Next
                handleActiveMedia(
                    slideShowFiles[indexOfActiveFile + 1],
                    "show"
                );
            }
        } else if (pressedKey === "ArrowLeft") {
            // Check if first file
            if (indexOfActiveFile === 0) {
                // Back to end
                handleActiveMedia(
                    slideShowFiles[slideShowFiles.length - 1],
                    "show"
                );
            } else {
                // Previous
                handleActiveMedia(
                    slideShowFiles[indexOfActiveFile - 1],
                    "show"
                );
            }
        }
    };

    // Get shared files
    useEffect(() => {
        // Get doc id
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const userId = urlParams.get("u");

        // Get firestore doc
        const listener = firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("files")
            .where("accepted", "==", false)
            .onSnapshot((snap) => {
                const newArray = [];
                snap.docs.forEach((doc) => {
                    newArray.push(doc.data());
                });
                setFiles(newArray);
            });
        //setFiles(null)

        return () => listener();
    }, []);

    // Listen for files
    useEffect(() => {
        if (!files || files.length === 0) return;

        // Format owner email
        const name = files[0].owner_email.split("@")[0];
        setOwner(name);

        // Get business
        const business =
            files[0].business.charAt(0).toUpperCase() +
            files[0].business.slice(1);
        setBusiness(business);

        // Create cards
        const cards = files.map((file) => {
            return (
                <CardFileStatic
                    file={file}
                    key={file.creation_time}
                    handleActiveMedia={handleActiveMedia}
                />
            );
        });
        setCards(cards);
    }, [files]);

    //__________ RENDER __________//
    return (
        <div className={styles.wrapper}>
            <Navbar noauth />
            <div className={styles.spacer}></div>
            {files && files.length > 0 && (
                <div className={styles.ownerContainer}>
                    <p>Delivery for</p>
                    <p>{owner}</p>
                    <p>from</p>
                    <p>{business}</p>
                </div>
            )}
            {files && files.length > 0 && (
                <div className={styles.fileContainer}>{cards}</div>
            )}
            {activeMedia && activeMedia.action === "show" && (
                <WatchContainer
                    activeMedia={activeMedia}
                    handleActiveMedia={handleActiveMedia}
                    handleWatchKeydown={handleWatchNavigatin}
                    thumbnail={"#"}
                />
            )}
            {files && files.length === 0 && (
                <div className={styles.unavailableContainer}>
                    <img
                        alt={"character floating in a void"}
                        src={emptyIllustration}
                    />
                    <h1>No deliveries</h1>
                    <p>
                        Contact your digitization partner to ask about pending
                        orders.
                    </p>
                </div>
            )}
        </div>
    );
}
