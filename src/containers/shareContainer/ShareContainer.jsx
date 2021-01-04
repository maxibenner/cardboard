import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { v4 as uuidv4 } from 'uuid';

import { FaHeart } from 'react-icons/fa'
import Toggle from '../../components/toggle/Toggle'
import Button from '../../components/button'


export default function ShareContainer({ firebase, handleModal, user, file }) {

    const [url, setUrl] = useState(
        file.shareId
            ?
            window.location.href.replace('/library', '/sh/') + file.shareId
            :
            null)

    // Keep file in sync
    useEffect(() => {

        // Update file state
        setUrl(() => file.shareId
            ?
            window.location.href.replace('/library', '/sh/') + file.shareId
            :
            null)

    }, [file])


    // Share logic
    const handleShare = () => {

        if (!url) {// => create reference

            // Get new doc id
            const id = uuidv4().replace(/-/g, '')

            // Create new firebase share directory
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .collection('shared')
                .doc(id)
                .set({
                    fileId: file.id,
                    name: file.name,
                    ownerEmail: user.email,
                    ownerId: user.uid,
                    thumbnail_url: file.thumbnail_url
                })
                .catch(err => window.alert(err))

            // Add share dir id to file
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .collection('files')
                .doc(file.id)
                .update({ shareId: id })
                .catch(err => window.alert(err))

        } else {// => delete reference

            // Remove firebase share directory
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .collection('shared')
                .doc(file.shareId)
                .delete()
                .catch(err => window.alert(err))

            // Remove shareId from file
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .collection('files')
                .doc(file.id)
                .update({ shareId: null })
                .catch(err => window.alert(err))

        }
    }

    // Copy url
    const handleCopyUrl = () => {
        navigator
            .clipboard
            .writeText(window.location.href.replace('/library', '/sh/') + file.shareId)
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
            <div className={styles.background} onClick={() => handleModal(null)} />
        </div>
    )
}
