import React, { createContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import { checkWasabiFile, sign_upload_url_business } from "../helpers/tools";
import firebase from "../lib/firebase";

export const UploaderContext = createContext(null);

export function UploaderProvider({ children }) {
    const [userRecord, setUserRecord] = useState(null);
    const [business, setBusiness] = useState(null);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [xhr, setXhr] = useState({});

    // Get env
    // const env = process.env.NODE_ENV === "production" ? "live" : "dev";

    // Set allowed simultaneous uploads
    const uploadLimit = 3;

    // Dispatch upload request
    const dispatchUpload = (userRecord, business, files) => {
        setBusiness(business)
        setUserRecord(userRecord)
        setUploadFiles(files);
    };

    // Augment and push to uploads
    useEffect(() => {
        //Early return
        if (uploadFiles.length === 0) return;

        setUploads((prevFiles) => {
            return [
                ...prevFiles,
                ...uploadFiles.map((file) => {
                    return {
                        status: "queue",
                        file: file,
                        id: v4(),
                        name: file.name,
                        owner_uid: userRecord.uid,
                        xhr: null,
                    };
                }),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFiles]);

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
        takeNewFiles();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploads]);

    // Create xhr
    async function createXhr(fileObject) {
        // Get file from file object
        const file = fileObject.file;

        // Get file id
        const fileId = fileObject.id;

        // Get upload url
        const uploadObject = await sign_upload_url_business({
            owner_uid: fileObject.owner_uid,
            name: file.name,
            type: file.type,
        }).catch(alert);

        // Destructure
        const { url, uuid, key, name } = uploadObject;

        // Create XHR object
        const xhr = new XMLHttpRequest();

        // onProgress
        xhr.upload.onprogress = (e) => {
            // Get progress
            const percentage = (e.loaded / e.total) * 100;

            console.log(percentage);

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
            console.log(`Error: ${e.message}`);
            removeUpload(fileId);
        };

        // onAbort
        xhr.onabort = () => {
            console.log("Aborted");
        };

        // onSuccess
        xhr.onload = async () => {
            // Set database
            console.log(key);
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
                    .doc(userRecord.uid)
                    .collection("files")
                    .doc(uuid)
                    .set({
                        delivery_status: "pending",
                        business: business,
                        creation_time: Date.now(),
                        storage_key: key,
                        name: name.split(".")[0],
                        owner: userRecord.uid,
                        owner_email: userRecord.email,
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
                    );
                } else if (file.type.split("/")[0] === "video") {
                    //Video
                    fetch(
                        `https://api.cardboard.fotura.co/video-thumb?key=${key}`
                    )
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
        <UploaderContext.Provider value={[uploads, dispatchUpload]}>
            {children}
        </UploaderContext.Provider>
    );
}
