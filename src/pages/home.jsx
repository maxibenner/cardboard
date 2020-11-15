import React, { useRef, useState } from 'react';
import useContent from '../hooks/use-content';
import { useAuthListener } from '../hooks/use-auth-listener';
import * as ROUTES from '../constants/routes';

import BrowseContainer from '../containers/browse';
import Uploader from '../components/uploader';
import Modal from '../containers/modal';
import ThreePartCard from '../components/threePartCard';
import Button from '../components/button';
import Navbar from '../components/navbar';
import styles from './home.module.css';
import { getSignedUploadUrl } from '../helpers/tools';


export default function Home() {

    //VARIABLES
    const { user } = useAuthListener();
    const uid = user.uid
    const { clips } = useContent("clips", uid);
    const inputRef = useRef(null)

    //STATE
    const [uploadModalActive, setUploadModalActive] = useState(false)
    const [uploadStyle, setUploadStyle] = useState(null)
    const [filesForUpload, setFilesForUpload] = useState([])
    const [uploadProgress, setUploadProgress] = useState({})
    console.log(filesForUpload)
    //FUNCTIONS
    const handleClick = () => {
        inputRef.current.click()
    };

    const onFileChange = () => {
        setUploadModalActive(true)
    };


    if (uploadStyle) {
        getSignedUploadUrl(inputRef.current.files[0]).then(({ url, uuid }) => {

            var xhr = new XMLHttpRequest();
            xhr.uuid = uuid;
            xhr.upload.onprogress = (e) => {
                const percentage = (e.loaded / e.total) * 100
                setUploadProgress(prevState => ({
                    ...prevState,
                    [uuid]: percentage
                }))
            };
            xhr.onerror = () => { xhr.abort() };
            xhr.onabort = () => {
                setFilesForUpload(prev => {
                    console.log(prev)
                    const newArr = prev.filter((obj) => {return obj.uuid !== xhr.uuid})
                    console.log(newArr)
                    return newArr?newArr:[]
                })
                /*const arrayWithoutAbortedElement = filesForUpload.filter(
                    (obj) => {
                        return obj.uuid !== xhr.uuid;
                    }
                );
                console.log(arrayWithoutAbortedElement)
                arrayWithoutAbortedElement ?
                    setFilesForUpload(arrayWithoutAbortedElement)
                    :
                    setFilesForUpload([]);*/
                setUploadProgress(prevState => { delete prevState[uuid] })

            };
            xhr.open('PUT', url.data[0], true);
            xhr.setRequestHeader('Content-Type', inputRef.current.files[0].type);
            xhr.send(inputRef.current.files[0]);

            setFilesForUpload(prev => [
                ...prev,
                {
                    uuid: uuid,
                    file: inputRef.current.files[0],
                    xhr: xhr
                }
            ]);
        });
        setUploadModalActive(false);
        setUploadStyle(null);
    }

    //COMPONENT
    return (
        <>
            <Navbar
                loggedIn
                to={ROUTES.HOME}
            />
            <Button
                blue
                onClick={handleClick}
                text="Add Video"
            />
            <input
                className={styles.hiddenInput}
                type="file"
                ref={inputRef}
                onChange={onFileChange}
            />
            <BrowseContainer
                clips={clips}
            />
            {filesForUpload.length > 0 &&
                <Uploader files={filesForUpload} progressObject={uploadProgress} />
            }
            <Modal
                show={uploadModalActive}
                onCancel={() => setUploadModalActive(false)}
                title="Editing"
                sub="Leave your video as it is or let our algorithm automatically cut it into scenes."
            >
                <div className={styles.horizontalContainer}>
                    <ThreePartCard
                        onClick={() => setUploadStyle('uncut')}
                        imgAlt={"uncut video"}
                        imgSrc={'./images/illustration--video_plain.svg'}
                        title={'Uncut'}
                        sub={'Upload the video as a whole. This only makes sense for special videos that need not be split'}
                    />
                    <ThreePartCard
                        onClick={() => setUploadStyle('cut')}
                        yellow
                        imgAlt={"auto cut video"}
                        imgSrc={'./images/illustration--scissors.svg'}
                        title={'Auto Cut'}
                        sub={'We split your videos into individual scenes. This is the best way to organize and rediscover specific memories.'} />
                </div>
            </Modal>
        </>
    );
};
