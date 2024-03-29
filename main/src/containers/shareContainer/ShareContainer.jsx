import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { v4 as uuidv4 } from 'uuid';

import { FaHeart } from 'react-icons/fa'
import Toggle from '../../components/toggle/Toggle'
import Button from '../../components/button'


export default function ShareContainer({ firebase, handleModal, user, selection }) {

    const [url, setUrl] = useState(null)

    // Keep url in sync
    useEffect(() => {

        setUrl(
            selection[0].share_id === null || !selection[0].share_id
            ?
            null
            :
            window.location.href.replace('/library', '/sh?id=') + selection[0].share_id)

    }, [selection])

    // Share logic
    const handleShare = async () => {

        if (!url) {// => create reference

            // Get new doc id
            const share_id = uuidv4().replace(/-/g, '')

            // Create new batch action
            const batch = firebase.firestore().batch()

            // Add actions to batch
            selection.forEach((file) => {

                // Add share id to local file
                file.share_id = share_id
                file.owner_email = user.email

                // Save to user share dir
                const userShareDir = firebase.firestore().collection('users').doc(user.uid).collection('public').doc('shared').collection(share_id).doc(file.id)
                batch.set(userShareDir, file);

                // Add share dir id to file
                const userFileDir = firebase.firestore().collection('users').doc(user.uid).collection('files').doc(file.id)
                batch.update(userFileDir, { share_id: share_id })

                // Save to public share dir
                const publicShareDir = firebase.firestore().collection('public').doc('shared').collection(share_id).doc(file.id)
                batch.set(publicShareDir, file)

            })

            // Execute batch actions
            batch.commit()



        } else {// => delete reference

            // Get all shared files under that share_id
            //const sharedFileDocs = await firebase.firestore().collection('public').doc('shared').collection(selection[0].share_id).get()

            // Create new batch action
            const batch = firebase.firestore().batch()

            // Add actions to batch
            selection.forEach((doc) => {

                const file = doc
                console.log(file)

                // Remove from user share dir
                const userShareDir = firebase.firestore().collection('users').doc(user.uid).collection('public').doc('shared').collection(file.share_id).doc(file.id)
                batch.delete(userShareDir)

                // Remove from public share dir
                const publicShareDir = firebase.firestore().collection('public').doc('shared').collection(file.share_id).doc(file.id)
                batch.delete(publicShareDir)

                // Remove share_id from file
                const userFileDir = firebase.firestore().collection('users').doc(user.uid).collection('files').doc(file.id)
                delete file.share_id;
                batch.set(userFileDir, file)

            })

            // Execute batch actions
            batch.commit()

        }
    }

    // Copy url
    const handleCopyUrl = () => {
        navigator
            .clipboard
            .writeText(window.location.href.replace('/library', '/sh?id=') + selection[0].share_id)
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
