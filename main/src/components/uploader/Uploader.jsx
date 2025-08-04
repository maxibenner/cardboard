import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import UploadElement from "../uploadElement/UploadElement";
import ButtonExpand from "../buttonExpand";
import { v4 as uuidv4 } from "uuid";
import { getSignedUploadUrl, checkWasabiFile } from "../../helpers/tools";

export default function Uploader({ firebase, user, files }) {
    const [open, setOpen] = useState(true);
    const [uploads, setUploads] = useState([]);
    const [xhr, setXhr] = useState({});

    // Get env
    // const env = process.env.NODE_ENV === "production" ? "live" : "dev";

    // Set allowed simultaneous uploads
    const uploadLimit = 3;

    // Augment and push to uploads
    useEffect(() => {
        setUploads((prevFiles) => {
            return [
                ...prevFiles,
                ...files.map((file) => {
                    return {
                        status: "queue",
                        file: file,
                        id: uuidv4(),
                        name: file.name,
                        xhr: null,
                    };
                }),
            ];
        });
    }, [files]);

    // Take new files from upload
    useEffect(() => {
        async function takeNewFiles() {
            // Number of current uploads
            const numberOfActive = Object.keys(xhr).length;

            // Add to active
            if (numberOfActive < uploadLimit) {
                // Number of possible new uploads
                const numberOfNew = uploadLimit - numberOfActive;

                // Get files to upload from queue
                //const toUpload = queuedUploads.splice(0, numberOfNew);
                const toUpload = [...uploads].splice(0, numberOfNew);

                // Filter out files thare already uploading
                const toUploadNoDuplicates = toUpload.filter(
                    (file) => !xhr[file.id]
                );

                // Get xhr for each file
                const uploadPromises = toUploadNoDuplicates.map((fileObject) =>
                    createXhr(fileObject)
                );

                // Await creation of xhr
                const xhrArr = await Promise.all(uploadPromises);

                // Convert array to object
                const xhrObj = xhrArr.reduce((prev, curr) => {
                    prev[curr.id] = {
                        xhr: curr.xhr,
                        progress: 0,
                    };
                    return prev;
                }, {});

                // Update uploads state
                setXhr((prev) => Object.assign(prev, xhrObj));
            }
        }
        takeNewFiles()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploads]);

    // Create xhr
    async function createXhr(fileObject) {
        // Get file from file object
        const file = fileObject.file;

        // Get file id
        const fileId = fileObject.id;

        // Get upload url
        const { url, uuid, key, name } = await getSignedUploadUrl({
            name: file.name,
            type: file.type,
        }).catch((e) =>
            console.error("Could not get signed upload URL!", e.message)
        );

        // Create XHR object
        const xhr = new XMLHttpRequest();

        // onProgress
        xhr.upload.onprogress = (e) => {
            // Get progress
            const percentage = (e.loaded / e.total) * 100;

            // Save progress
            setXhr((prev) => {
                if (prev[fileObject.id]) {
                    prev[fileObject.id].progress = percentage;
                    return { ...prev };
                } else {
                    return prev;
                }
            });
        };

        // onError
        xhr.onerror = (e) => {
            console.log(`Error: ${e}`);
            removeUpload(fileId);
        };

        // onAbort
        xhr.onabort = () => {
            console.log("Aborted");
        };

        // onSuccess
        xhr.onload = async () => {
            // Set database
            const res = await checkWasabiFile(key);

            // Proceed if file exists
            if (res.data) {
                // Get download url
                const urlObject = await firebase
                    .functions()
                    .httpsCallable("sign_wasabi_download_url")({
                        storage_key: key,
                    });

                // Create Firestore object
                await firebase
                    .firestore()
                    .collection("users")
                    .doc(user.uid)
                    .collection("files")
                    .doc(uuid)
                    .set({
                        creation_time: Date.now(),
                        owner_email: user.email,
                        storage_key: key,
                        name: name.split(".")[0],
                        owner: user.uid,
                        path: "/",
                        status: "new",
                        suffix: key.split(".")[1],
                        tags: [],
                        type: file.type.split("/")[0],
                        url: urlObject.data,
                    });

                // Remove from uploads
                removeUpload(fileId);

                // Get thumbnails
                if (file.type.split("/")[0] === "image") {
                    //Image
                    await fetch(
                        `https://api.cardboard.fotura.co/img-thumb?key=${key}`
                    ).catch((e) =>
                        console.error(e)
                    );
                } else if (file.type.split("/")[0] === "video") {
                    //Video
                    fetch(
                        `https://api.cardboard.fotura.co/video-thumb?key=${key}`
                    ).catch((e) =>
                        console.error(e)
                    );
                }
            } else {
                window.alert(
                    "There was a problem with your upload. Please try again."
                );
            }
        };

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        // Start upload
        xhr.send(file);

        return Promise.resolve({ id: fileObject.id, xhr: xhr });
    }

    // Remove upload
    const removeUpload = (id) => {
        // Remove xhr
        if (xhr[id]) {
            xhr[id].xhr.abort();
            setXhr((prev) => {
                delete prev[id];
                return { ...prev };
            });
        }

        // Remove from uploader
        setUploads((prev) => {
            // Get all files except the one to be removed
            const filteredUploads = prev.filter((file) => file.id !== id);
            return [...filteredUploads];
        });
    };

    return (
        <>
            {uploads && uploads.length > 0 && (
                <div className={styles.uploader}>
                    <div className={styles.header}>
                        <p>Uploads</p>
                        <ButtonExpand
                            light
                            onClick={() => setOpen((state) => !state)}
                        />
                    </div>
                    <div
                        className={`${styles.filesContainer} ${open === false && styles.closed
                            }`}
                    >
                        {uploads.map((el) => (
                            <UploadElement
                                active={xhr[el.id]}
                                key={el.id}
                                id={el.id}
                                progress={xhr[el.id] ? xhr[el.id].progress : 0}
                                name={el.name}
                                removeUpload={(id) => removeUpload(id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
