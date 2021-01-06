import React, { useRef, useState, useEffect } from 'react';
import { firebase } from '../lib/firebase';
import styles from './sh.module.css';

import WatchContainer from '../containers/watch';
import Navbar from '../components/navbar';
import CardFile from '../components/cardFile/CardFile';



export default function Share() {


    //__________ STATE __________//
    const [files, setFiles] = useState(null);
    const [cards, setCards] = useState(null);
    const [owner, setOwner] = useState(null)

    const [activeMedia, setActiveMedia] = useState(null);
    const [visibleFiles, setVisibleFiles] = useState();


    //__________ FUNCTIONS __________//


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


    // Get shared files
    useEffect(() => {

        // Get doc id
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const docId = urlParams.get('id')

        // Get firestore doc
        firebase.firestore().collection('shared').doc(docId).get().then((doc) => {
            setFiles([doc.data()])
        })

    }, [])

    // Listen for files
    useEffect(() => {

        if(!files) return
        
        // Format owner email 
        const nameString = files[0].ownerEmail.split('@')[0]
        const name = nameString.charAt(0).toUpperCase() + nameString.slice(1)
        setOwner(name)

        // Create cards
        const cards = files.map((file)=>{
            return <CardFile />
        })
        setCards(()=>cards)


        

    },[files])




    //__________ RENDER __________//
    return (
        <div className={styles.wrapper}>
            <Navbar
                noauth
            />
            <div className={styles.spacer}></div>
            <div className={styles.ownerContainer}>
                <p>Shared by</p>
                <p>{owner}</p>
            </div>
            <div className={styles.fileContainer}>
                {cards}
            </div>
            {activeMedia && activeMedia.action === 'show' &&
                <WatchContainer
                    activeMedia={activeMedia}
                    handleActiveMedia={handleActiveMedia}
                    handleWatchKeydown={handleWatchNavigatin}
                    thumbnail={'#'} />
            }
        </div>
    );
};