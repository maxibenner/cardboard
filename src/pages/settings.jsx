import React, { useEffect, useState } from 'react';
import * as ROUTES from '../constants/routes';
import styles from './settings.module.css';
import { useAuthListener } from '../hooks/use-auth-listener';
import { firebase } from '../lib/firebase';
import CardSettings from '../components/cardSettings';
import Navbar from '../components/navbar';
import Plan from '../modals/plan';

import { MdRefresh, MdEdit } from 'react-icons/md';


export default function Settings(props) {

    const { user } = useAuthListener()
    const [userInfo, setUserInfo] = useState(null);
    const [activeModal, setActiveModal] = useState(null)

    // Keep user info in sync
    useEffect(() => {

        const listener = firebase.firestore().collection('users').doc(user.uid)
            .onSnapshot(
                (snap) => {

                    const capacity_used = snap.data().capacity_used

                    if (capacity_used < 1048575999) {
                        setUserInfo({
                            storage_capacity: (snap.data().storage_capacity / 1000000000),
                            capacity_used: `${(capacity_used / 1000000).toFixed(0)} MB`
                        });
                    } else {
                        setUserInfo({
                            storage_capacity: (snap.data().storage_capacity / 1000000000),
                            capacity_used: `${(capacity_used / 1000000000).toFixed(3)} GB`
                        });
                    }
                }
            );

        return () => listener()

    }, [user.uid]);


    // Change modal
    const changeModal = (modal) => {
        setActiveModal(modal)
    }

    // Change password
    const changePassword = () => {
        firebase.auth().sendPasswordResetEmail(user.email).then(function () {
            // Update successful.
            window.alert(`We sent an email for resetting your password to ${user.email}.`)
        }).catch(function (error) {
            // An error happened.
        });
    }



    return (
        <div>
            <Navbar
                loggedIn
                to={ROUTES.LIBRARY}
            />
            <div className={styles.spacer70}></div>
            {activeModal === 'plan' && <Plan
                onClick={changeModal}
                firebase={firebase}
                user={user}
            />}
            {userInfo ?
                <>
                    <div className={styles.container}>
                        <h2>Personal Info</h2>
                        <CardSettings title={"Email"} info={user.email} />
                        <CardSettings title={"Password"} info={"•••••••••"} icon={<MdRefresh />} onClick={changePassword} />
                        <h2>Subscription</h2>
                        <CardSettings title={"Plan"} info={"Free"} icon={<MdEdit />} onClick={() => changeModal('plan')} />
                        <CardSettings title={"Storage"} info={`${userInfo.capacity_used} / ${userInfo.storage_capacity}GB used`} />
                    </div>
                </>
                :
                null}

        </div>

    );
}