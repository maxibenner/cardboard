import React, { useRef, useState, useEffect } from 'react';
import { useAuthListener } from '../hooks/use-auth-listener';
import { firebase } from '../lib/firebase';
import * as ROUTES from '../constants/routes';
import styles from './library.module.css';

import BrowseContainer from '../containers/browse/Browse';
import WatchContainer from '../containers/watch';
import TagSearch from '../containers/tagSearch';
import Uploader from '../components/uploader';
import Navbar from '../components/navbar';
import ButtonLight from '../components/buttonLight';
import { IoMdArrowDropdown } from 'react-icons/io'
import { MdCloudUpload } from 'react-icons/md'

import LabelFile from '../containers/labelFile';
import DropdownFull from '../components/dropdownFull';
import ShareContainer from '../containers/shareContainer/ShareContainer';



export default function Library() {

    //__________ VARS __________//
    const { user } = useAuthListener();


    //__________ REFS __________//
    const inputRef = useRef(null);


    //__________ STATE __________//
    const [files, setFiles] = useState(null);

    const [filesForUpload, setFilesForUpload] = useState([]);
    //const [activeUploads, setActiveUploads] = useState([]);

    const [activeMedia, setActiveMedia] = useState(null);
    const [selection, setSelection] = useState([])
    const [visibleFiles, setVisibleFiles] = useState();

    const [tags, setTags] = useState([])
    const [activeTags, setActiveTags] = useState(null)


    //__________ FUNCTIONS __________//

    // Handle UPLOAD click
    const handleClick = () => {
        inputRef.current.click()
    };

    // Handle file upload selection
    const onFileChange = (e) => {
        setFilesForUpload(() => [...e.target.files])
    };

    // Set active file
    const handleActiveMedia = async (fileObject, action) => {// Available actions are: "show" and "label"

        // Show placeholder
        setActiveMedia(() => {
            const ph = {
                type: false,
                action: action
            }
            return ph
        })

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
                const url = await firebase.functions().httpsCallable('sign_wasabi_download_url')(fileObject)
                fileObject.url = url.data
                
                setActiveMedia(fileObject)
            }


        } else if (action === "label") {// Label file

            // Set action
            fileObject.action = 'label'

            // Set active media
            setActiveMedia(fileObject)
        }
        else if (action === 'share') {

            // Set action
            fileObject.action = 'share'

            // Set active media
            setActiveMedia(fileObject)

        }
    }

    // Handle file navigation
    const handleWatchNavigatin = (pressedKey) => {

        // Get new visible index of only files
        const slideShowFiles = visibleFiles.filter((element) => { return element.display_type === 'file' })

        // Get index of currently active element in visibleFiles array
        const indexOfActiveFile = slideShowFiles.findIndex((file) => file.id === activeMedia.id)

        // Previous/Next file
        if (pressedKey === "ArrowRight") {

            // Check if last file
            if (indexOfActiveFile + 1 === slideShowFiles.length) {

                // Back to start
                handleActiveMedia(slideShowFiles[0], "show")

            } else {

                // Next
                handleActiveMedia(slideShowFiles[indexOfActiveFile + 1], "show")
            }

        } else if (pressedKey === "ArrowLeft") {

            // Check if first file
            if (indexOfActiveFile === 0) {

                // Back to end
                handleActiveMedia(slideShowFiles[slideShowFiles.length - 1], "show")

            } else {

                // Previous
                handleActiveMedia(slideShowFiles[indexOfActiveFile - 1], "show")
            }


        }

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

        setTags(newTagArray)

    }, [files])

    // Refresh currently active media on file change
    useEffect(() => {

        if (!activeMedia) return

        // Get action type
        const type = activeMedia.action

        // Get updated file
        const updatedFile = files.filter((el) => el.id === activeMedia.id)

        // Merge updated file and action type
        updatedFile[0].action = type

        // Update
        setActiveMedia(() => updatedFile[0])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files])

    // Keep selected files in sync
    useEffect(() => {

        const updatedSelectionFiles = []

        selection.forEach((file) => {
            updatedSelectionFiles.push(files.filter((el) => el.id === file.id)[0])
        })

        setSelection(updatedSelectionFiles)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files])



    //__________ RENDER __________//
    return (
        <div className={styles.wrapper}>
            <Navbar
                loggedIn
                to={ROUTES.LIBRARY}
            />
            <div className={styles.spacer70}></div>
            <div className={styles.searchBarContainer}>
                <TagSearch
                    tags={tags}
                    setActiveTags={setActiveTags}
                />
            </div>
            <div className={styles.actionContainer}>
                <DropdownFull down icon={
                    <ButtonLight
                        title="More"
                        icon={<IoMdArrowDropdown />}
                    />
                }
                >
                    <ButtonLight title={'Upload'} icon={<MdCloudUpload />} onClick={handleClick} />
                </DropdownFull>

            </div>
            {files &&
                <BrowseContainer
                    files={files}
                    activeTags={activeTags}
                    user={user}
                    firebase={firebase}
                    sendSelectionToParent={setSelection}
                    sendVisibleFilesToParent={setVisibleFiles}
                    handleActiveMedia={handleActiveMedia}
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
            {selection[0] &&
                <ShareContainer
                    handleModal={setSelection}
                    selection={selection}
                    user={user}
                    firebase={firebase}
                />
            }
            {filesForUpload.length > 0 &&
                <Uploader
                    inputRef={inputRef}
                    files={filesForUpload}
                    user={user}
                    firebase={firebase}
                />
            }
            <input
                className={styles.hiddenInput}
                type="file"
                multiple
                ref={inputRef}
                onChange={onFileChange}
            />
        </div>
    );
};