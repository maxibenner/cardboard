import React, { useState, useEffect } from "react";
import { firebase } from "../lib/firebase";
import styles from "./delivery.module.css";

import WatchContainer from "../containers/watch/WatchContainer";
import Navbar from "../components/navbar";
import CardFileStatic from "../components/cardFileStatic/CardFileStatic";
import DeliveryInfo from "../components/deliveryInfo/DeliveryInfo";
import CreateAccountContainer from "../containers/createAccountContainer/CreateAccountContainer";

import emptyIllustration from "../media/illustration-empty.svg";
import { AnimatePresence } from "framer-motion";

export default function Share() {
    const [files, setFiles] = useState(null);
    const [cards, setCards] = useState(null);
    const [user, setUser] = useState({});
    const [business, setBusiness] = useState(null);
    const [fileSize, setFileSize] = useState(0);

    const [activeMedia, setActiveMedia] = useState(null);
    const [createAccActive, setCreateAccActive] = useState(false);

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

    // Get delivery files
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
            .where("delivery_status", "==", "pending")
            .onSnapshot((snap) => {
                const newArray = [];
                var fileSize = 0;
                snap.docs.forEach((doc) => {
                    newArray.push(doc.data());
                    fileSize += doc.data().size;
                });
                setFiles(newArray);
                setFileSize(fileSize);
            });

        return () => listener();
    }, []);

    // Listen for files
    useEffect(() => {
        if (!files || files.length === 0) return;

        // Format owner email
        const name = files[0].owner_email.split("@")[0];
        setUser({ name: name, email: files[0].owner_email });

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
            <Navbar noauth relative />
            <AnimatePresence>
                {createAccActive && (
                    <CreateAccountContainer
                        user={user}
                        onClose={() => setCreateAccActive(false)}
                    />
                )}
            </AnimatePresence>
            {files && files.length > 0 && (
                <>
                    <DeliveryInfo
                        fileSize={fileSize}
                        onClick={() => setCreateAccActive(true)}
                    />
                    <p className={styles.ownerContainer}>
                        Delivery for{" "}
                        <span style={{ fontWeight: "bold" }}>{user.name}</span> from{" "}
                        <span style={{ fontWeight: "bold" }}>{business}</span>
                    </p>
                </>
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
