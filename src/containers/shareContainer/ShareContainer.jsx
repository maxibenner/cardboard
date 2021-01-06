import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { v4 as uuidv4 } from 'uuid';

import { FaHeart } from 'react-icons/fa'
import Toggle from '../../components/toggle/Toggle'
import Button from '../../components/button'


export default function ShareContainer({ firebase, handleModal, user, selection }) {

    const [url, setUrl] = useState(
        selection[0].shareId !== null
            ?
            window.location.href.replace('/library', '/sh?id=') + selection[0].shareId
            :
            null)

    useEffect(() => {

        setUrl(selection[0].shareId !== null
            ?
            window.location.href.replace('/library', '/sh?id=') + selection[0].shareId
            :
            null)
    }, [selection])

    // Share logic
    const handleShare = async () => {

        if (!url) {// => create reference

            // Get new doc id
            const id = uuidv4().replace(/-/g, '')

            // Create new batch action
            const batch = firebase.firestore().batch()

            // Add actions to batch
            selection.forEach((file) => {

                // Add share id to local file
                file.shareId = id

                // Save to user share dir
                const userShareDir = firebase.firestore().collection('users').doc(user.uid).collection('shared').doc(id)
                batch.set(userShareDir, file);

                // Add share dir id to file
                const userFileDir = firebase.firestore().collection('users').doc(user.uid).collection('files').doc(file.id)
                batch.update(userFileDir, { shareId: id })

                // Save to public share dir
                const publicShareDir = firebase.firestore().collection('public').doc('shared').collection(id).doc(file.id)
                batch.set(publicShareDir, file)

            })

            // Execute batch actions
            batch.commit()



        } else {// => delete reference

            // Get all shared files under that shareId
            const sharedFileDocs = await firebase.firestore().collection('public').doc('shared').collection(selection[0].shareId).get()

            // Create new batch action
            const batch = firebase.firestore().batch()

            // Add actions to batch
            sharedFileDocs.forEach((doc) => {

                const file = doc.data()

                // Remove from user share dir
                const userShareDir = firebase.firestore().collection('users').doc(user.uid).collection('shared').doc(file.shareId)
                batch.delete(userShareDir)

                // Remove shareId from file
                const userFileDir = firebase.firestore().collection('users').doc(user.uid).collection('files').doc(file.id)
                batch.update(userFileDir, { shareId: null })

                // Remove from public share dir
                const publicShareDir = firebase.firestore().collection('public').doc('shared').collection(file.shareId).doc(file.id)
                batch.delete(publicShareDir)

            })

            // Execute batch actions
            batch.commit()

        }
    }

    // Copy url
    const handleCopyUrl = () => {
        navigator
            .clipboard
            .writeText(window.location.href.replace('/library', '/sh?id=') + selection[0].shareId)
            .then(
                () => window.alert('Link has been copied to clipboard'),
                () => window.alert("Your browser doesn't support automatically copying to clipboard. Please manually select the link to share it.")
            );
    }

    return (
        <div className={styles.wrapper}>

            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h1>Share</h1>
                    <FaHeart />
                </div>
                <div className={styles.toggleContainer}>
                    <p>Enable sharing for this memory</p>
                    <Toggle onClick={handleShare} active={url !== null ? true : false} />
                </div>
                {url !== null && <div className={styles.linkContainer}>
                    <div className={styles.textContainer}>
                        <div className={styles.link}>{url}</div>
                    </div>
                    <div className={styles.mobile}>
                        <Button blue text={'Copy link'} onClick={handleCopyUrl} />
                    </div>
                    <div className={styles.desktop}>
                        <Button blue fitText text={'Copy link'} onClick={handleCopyUrl} />
                    </div>

                </div>}
            </div>
            <div className={styles.background} onClick={() => handleModal([])} />
        </div>
    )
}
