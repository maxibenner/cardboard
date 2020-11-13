import React, { useContext, useRef, useState } from 'react';
import useContent from '../hooks/use-content';
import { useAuthListener } from '../hooks/use-auth-listener';
import { FirebaseContext } from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { v4 as uuidv4 } from 'uuid';
import { removeDotsKeepExtension } from '../helpers/convenience';

import BrowseContainer from '../containers/browse';
import Modal from '../containers/modal';
import ThreePartCard from '../components/threePartCard';
import Button from '../components/button';
import Navbar from '../components/navbar';
import styles from './home.module.css';
import Uploader from '../components/uploader';

export default function Home() {

    const { firebase } = useContext(FirebaseContext);
    const { user } = useAuthListener();
    const uid = user.uid

    const [uploadModal, setUploadModal] = useState(false)
    console.log(uploadModal)

    const { clips } = useContent("clips", uid);

    const inputRef = useRef(null)

    const onFileChange = (e) => {

        const uuid = uuidv4()
        const sanitizedFileName = removeDotsKeepExtension(e.target.files[0].name)

        firebase.functions().httpsCallable('signUploadUrl')({
            id: uuid,
            contentType: e.target.files[0].type,
            extension: e.target.files[0].name.split('.')[1]
        }).then((url) => {
            console.log(url)
            setUploadModal(true)
        })

    }

    const handleClick = () => {
        inputRef.current.click()
    };

    return (
        <>
            <Navbar loggedIn to={ROUTES.HOME} />
            <Button blue onClick={handleClick} text="Add Video" />
            <input className={styles.hiddenInput} type="file" name="file" ref={inputRef} onChange={onFileChange} />
            <BrowseContainer clips={clips} />
            {/*<Uploader />*/}
            <Modal show={uploadModal}>
                <div className={styles.horizontalContainer}>
                    <ThreePartCard title={'Uncut'} sub={'Upload the video as a whole. This only makes sense for special videos that need not be split'} />
                    <ThreePartCard title={'Auto Cut'} sub={'We split your videos into individual scenes. This is the best way to organize and rediscover specific memories.'} />
                </div>
            </Modal>
        </>
    );



};
