import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import UploadElement from '../uploadElement';
import ButtonExpand from '../buttonExpand';
import { v4 as uuidv4 } from 'uuid';

import { getSignedUploadUrl, checkWasabiFile } from '../../helpers/tools';

export default function Uploader({ inputRef, firebase, user, files }) {

    const [open, setOpen] = useState(true)

    const [queue, setQueue] = useState([])
    const [activeUploads, setActiveUploads] = useState([])

    // Set number of simultaneously allowed uploads
    const parallelUploads = 3

    // Get env
    const env = process.env.NODE_ENV === 'production' ? 'live' : 'dev' 

    // Push to queue
    useEffect(() => {

        if (files.length === 0) return

        setQueue(prev => {

            const newArray = []

            // Add data to each file
            files.forEach((file) => {

                const id = uuidv4()
                const newFile = {
                    file: file,
                    id: id,
                    name: file.name,
                    progress: 0
                }
                newArray.push(newFile)
            })

            return [...prev, ...newArray]

        })

    }, [files])


    // Push to activeUploads & remove from queue
    useEffect(() => {

        if (queue.length === 0) return

        // Limit number of simultaneous uploads
        else if (activeUploads.length >= parallelUploads) return

        // Check for duplicates
        else if ((activeUploads.filter((el) => el.id === queue[0].id)).length === 1) return

        // Get new file
        const newFile = queue[0]

        // Get file
        const file = newFile.file

        // Get file id
        const fileId = newFile.id


        //__________ Add upload __________//

        // Upload setup
        getSignedUploadUrl(newFile.file).then(({ url, uuid, key, name }) => {


            //____________ XHR Setup ____________//
            var xhr = new XMLHttpRequest();

            // onProgress
            xhr.upload.onprogress = (e) => {
                const percentage = (e.loaded / e.total) * 100

                setActiveUploads(prev => {

                    const index = prev.map((el) => el.id).indexOf(fileId)
                    prev[index].progress = percentage

                    return [...prev]
                })
            };

            // onError
            xhr.onerror = () => { xhr.abort() };

            // onAbort
            xhr.onabort = () => {

                setActiveUploads(prev => {
                    const index = prev.map((el) => el.id).indexOf(fileId)
                    prev.splice(index, 1)
                    return prev ? [...prev] : []
                })
            };

            // onSuccess
            xhr.onload = () => {

                // Set database
                checkWasabiFile(key).then((res) => {

                    if (res.data) {

                        // Add to firestore
                        firebase.firestore().collection("users").doc(user.uid).collection("files").doc(uuid).set({
                            storage_key: key,
                            name: name.split('.')[0],
                            owner: user.uid,
                            path: '/',
                            suffix: key.split('.')[1],
                            tags: [],
                            type: file.type.split('/')[0]
                        }).then(() => {

                            if (file.type.split('/')[0] === 'image') {//image
                                fetch(`https://img-thumb.cardboard.video/img-thumb-${env}?key=${key}`)
                                    .then(function (response) {
                                        console.log(response)
                                        return
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    });
                            }else if(file.type.split('/')[0] === 'video') {//video
                                fetch(`https://img-thumb.cardboard.video/video-thumb-${env}?key=${key}`)
                                    .then(function (response) {
                                        console.log(response)
                                        return
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    });
                            }

                            // Clear input
                            //inputRef.current.value = ''

                        })



                    } else {
                        window.alert('There was a problem with your upload. Please try again.')
                    }

                    setActiveUploads(prev => {
                        const index = prev.map((el) => el.id).indexOf(fileId)
                        prev.splice(index, 1)
                        return prev ? [...prev] : []
                    })

                })


            };

            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file)

            return xhr

        }).then((xhr) => {

            // Append xhr to element
            newFile.xhr = xhr

            // Remove from queue
            setQueue(prev => {
                prev.splice(0, 1);
                return prev
            })

            //Push to active Uploads
            setActiveUploads(prev => {
                return [...prev, newFile]
            })


        })

    }, [queue, activeUploads.length])



    // Minimize element
    function minimize() {
        setOpen(state => !state)
    }

    return (
        <>
            {activeUploads.length > 0 &&
                <div className={styles.uploader}>
                    <div className={styles.header}>
                        <p>Uploads</p>
                        <ButtonExpand light onClick={minimize} />
                    </div>
                    {activeUploads.length > 0 && open &&
                        <div className={styles.filesContainer}>
                            {activeUploads.map(el => (
                                <UploadElement
                                    active={true}
                                    key={el.id}
                                    progress={el.progress}
                                    name={el.name}
                                    xhr={el.xhr} />
                            ))}
                        </div>
                    }
                    {queue.length > 0 && open &&
                        <div className={styles.filesContainer}>
                            {queue.map(el => (
                                <UploadElement
                                    active={false}
                                    key={el.id}
                                    progress={el.progress}
                                    name={el.name}
                                    xhr={el.xhr} />
                            ))}
                        </div>
                    }
                </div>}
        </>
    );
}