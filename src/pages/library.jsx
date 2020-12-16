import React, { useRef, useState, useEffect } from 'react';
import { useAuthListener } from '../hooks/use-auth-listener';
import { firebase } from '../lib/firebase';
import * as ROUTES from '../constants/routes';
import styles from './library.module.css';

import BrowseContainer from '../containers/browse';
import WatchContainer from '../containers/watch';
import TagSearch from '../containers/tagSearch';
import Uploader from '../components/uploader';
import Button from '../components/button';
import Navbar from '../components/navbar';

import { getSignedUploadUrl, checkWasabiFile } from '../helpers/tools';
import LabelFile from '../containers/labelFile';


export default function Library() {


    //__________ VARS __________//
    const { user } = useAuthListener();



    //__________ REFS __________//
    const inputRef = useRef(null);


    //__________ STATE __________//
    const [files, setFiles] = useState(null);
    const [filesForUpload, setFilesForUpload] = useState([]);
    const [activeMedia, setActiveMedia] = useState(null);
    const [visibleElements, setVisibleElements] = useState(null);
    const [sortedElements, setSortedElements] = useState([])
    const [activeModal, setActiveModal] = useState(null)
    const [tags, setTags] = useState([])
    const [activeTags, setActiveTags] = useState([])
    const [elementsWithActiveTags, setElementsWithActiveTags] = useState([])

    //__________ FUNCTIONS __________//

    // Handle UPLOAD click
    const handleClick = () => {
        inputRef.current.click()
    };

    // Handle file upload selection
    const onFileChange = (e) => {
        uploadFile(e.target.files)
    };

    // Handle modal
    const handleModal = (modal) => {
        setActiveModal(modal)
    }

    // Upload file to Wasabi
    const uploadFile = (filesList) => {

        const filesArray = [...filesList]
        filesArray.forEach((file) => {

            getSignedUploadUrl(file).then(({ url, uuid, key, name }) => {

                var xhr = new XMLHttpRequest();
                xhr.uuid = uuid;

                //onProgress
                xhr.upload.onprogress = (e) => {
                    const percentage = (e.loaded / e.total) * 100
                    setFilesForUpload(prev => {
                        const index = prev.findIndex((element) => element.uuid === xhr.uuid);
                        prev[index].progress = percentage;
                        return [...prev]
                    })
                };
                //onError
                xhr.onerror = () => { xhr.abort() };
                //onAbort
                xhr.onabort = () => {
                    setFilesForUpload(prev => {
                        const newArr = prev.filter((obj) => { return obj.uuid !== xhr.uuid })
                        return newArr ? newArr : []
                    })
                };
                //onSuccess
                xhr.onload = () => {

                    // Remove from upload tracker
                    setFilesForUpload(prev => {
                        const newArr = prev.filter((obj) => { return obj.uuid !== xhr.uuid })
                        return newArr ? newArr : []
                    })

                    // Set database
                    checkWasabiFile(key).then((res) => {

                        var isRaw = false
                        if (file.type.split('/')[0] === 'video') { isRaw = true }

                        if (res) {
                            firebase.firestore().collection("users").doc(user.uid).collection("files").doc(uuid).set({
                                isRaw: isRaw,
                                storage_key: key,
                                name: name.split('.')[0],
                                owner: user.uid,
                                path: '/',
                                suffix: key.split('.')[1],
                                type: file.type.split('/')[0]
                            })

                        } else {
                            window.alert('There was a problem with your upload. Please try again.')
                        }

                    })
                };

                xhr.open('PUT', url, true);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);

                setFilesForUpload(prev => [
                    ...prev,
                    {
                        uuid: uuid,
                        progress: 0,
                        file: file,
                        xhr: xhr
                    }
                ]);
            });
        })
    }

    // Set active file
    const handleActiveMedia = async (fileObject, action) => {// Available actions are: "show" and "label"

        // Remove active media if null
        !fileObject && setActiveMedia(null)

        if (action === "show") {// Display file

            //Set action
            fileObject.action = "show"

            if (fileObject === null) {
                return setActiveMedia(fileObject)

            } else if (fileObject.url) {
                // Only get url if it doesn't exist, yet. -> Maybe dangerous as url expires after 6 hours
                return setActiveMedia(fileObject)
            } else {
                const url = await firebase.functions().httpsCallable('sign_wasabi_download_url')(fileObject.storage_key)
                fileObject.url = url.data
                setActiveMedia(fileObject)
            }


        } else if (action === "label") {// Label file

            // Set action
            fileObject.action = 'label'

            // Set active media
            setActiveMedia(fileObject)
        }
    }


    // Handle file navigation
    const handleWatchNavigatin = (pressedKey) => {

        // Get new visible index of only files
        const visibleFiles = sortedElements.filter((element) => { return element.display_type === 'file' })

        // Get index of currently active element in visibleFiles array
        const indexOfActiveFile = visibleFiles.findIndex((file) => file.id === activeMedia.id)

        // Previous/Next file
        if (pressedKey === "ArrowRight") {

            // Check if last file
            if (indexOfActiveFile + 1 === visibleFiles.length) {

                // Back to start
                handleActiveMedia(visibleFiles[0], "show")

            } else {

                // Next
                handleActiveMedia(visibleFiles[indexOfActiveFile + 1], "show")
            }

        } else if (pressedKey === "ArrowLeft") {

            // Check if first file
            if (indexOfActiveFile === 0) {

                // Back to end
                handleActiveMedia(visibleFiles[visibleFiles.length - 1], "show")

            } else {

                // Previous
                handleActiveMedia(visibleFiles[indexOfActiveFile - 1], "show")
            }


        }

    }

    // Handle visible files in current path
    const handleVisibleElements = (visibleElements) => {

        // TODO: Only activate by tag criterion
        setVisibleElements(visibleElements)
    }

    //__________ EFFECTS __________//
    // Keep files in sync
    useEffect(() => {

        const listener = firebase.firestore().collection('users').doc(user.uid).collection('files')
            .onSnapshot(
                (snap) => {

                    // For each file change
                    const files = snap.docs.map((doc) => {

                        const file = doc.data()

                        //Add id to be used as react list key
                        file.id = doc.id

                        return file

                    })
                    setFiles(files);

                }
            );
        return () => listener()

    }, [user.uid]);

    // Get thumbnail urls
    useEffect(() => {

        // Add thumbnail url
        if (files) {
            files.forEach(async (file) => {

                //Check if file has thumbnail_key => add thumbnail_url if it doesn't exist
                if (file.thumbnail_key && file.thumbnail_url === undefined) {

                    // Get download url
                    const url = await firebase.storage().ref().child(file.thumbnail_key).getDownloadURL()

                    // Update firestore
                    firebase.firestore().collection("users").doc(user.uid).collection("files").doc(file.id).update({
                        thumbnail_url: url
                    })
                };
            })
        }

    }, [files, user.uid])

    // Sort files
    useEffect(() => {

        if (visibleElements && elementsWithActiveTags.length === 0) {

            // Initialize new array
            const sortedVisibleElements = [...visibleElements]

            // Sort new array in descending order
            sortedVisibleElements.sort((a, b) => (a.name > b.name ? 1 : -1))

            // Update sorted elements
            setSortedElements(sortedVisibleElements)

        } else { // filtered by tags

            // Initialize new array
            const sortedVisibleElements = [...elementsWithActiveTags]

            // Sort new array in descending order
            sortedVisibleElements.sort((a, b) => (a.name > b.name ? 1 : -1))

            // Update sorted elements
            setSortedElements(sortedVisibleElements)
        }


    }, [visibleElements, elementsWithActiveTags])

    // Set tags
    useEffect(() => {

        var newTagArray = []

        // Put all tags into one array
        files && files.forEach(file => {

            // Push tag if unique
            file.tags && file.tags.forEach(tag => {
                !newTagArray.includes(tag) && newTagArray.push(tag)
            })

        })

    }, [files])

    // Get elements with active tags
    useEffect(() => {

        var results = []

        // Make sure files exist
        if (files) {

            if (activeTags.length === 0) {
                results = []
            } else {
                // Filter for tags
                results = files.filter(file =>
                    activeTags.every(constraint =>
                        file.tags && file.tags.some(obj => obj === constraint)
                    )
                );
            }

        }

        setElementsWithActiveTags(results)

    }, [activeTags])

    return (
        <div className={styles.wrapper}>
            <Navbar
                loggedIn
                to={ROUTES.LIBRARY}
            />
            <div className={styles.spacer70}></div>
            <div className={styles.searchBarContainer}>
                <TagSearch tags={tags} setActiveTags={setActiveTags} />
            </div>
            <div className={styles.actionContainer}>
                <Button
                    blue
                    fitText
                    onClick={handleClick}
                    text="Upload"
                />
            </div>
            {files &&
                <BrowseContainer
                    files={files}
                    sortedElements={sortedElements}
                    user={user}
                    firebase={firebase}
                    handleActiveMedia={handleActiveMedia}
                    handleVisibleElements={handleVisibleElements}
                    handleModal={handleModal}
                />
            }
            {activeMedia && activeMedia.action === 'show' &&
                <WatchContainer
                    activeMedia={activeMedia}
                    handleActiveMedia={handleActiveMedia}
                    handleWatchKeydown={handleWatchNavigatin}
                    thumbnail={'#'} />
            }
            {activeMedia && activeMedia.action === 'label' &&
                <LabelFile
                    handleModal={handleActiveMedia}
                    file={activeMedia}
                    user={user}
                    firebase={firebase}
                />
            }
            {filesForUpload.length > 0 &&
                <Uploader files={filesForUpload} />
            }
            <input
                className={styles.hiddenInput}
                onClick={() => console.log('clicked')}
                type="file"
                multiple
                ref={inputRef}
                onChange={onFileChange}
            />
        </div>
    );
};