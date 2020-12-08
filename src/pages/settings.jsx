import React, { useEffect, useState } from 'react';
import * as ROUTES from '../constants/routes';
import styles from './settings.module.css';
import { useAuthListener } from '../hooks/use-auth-listener';
import { firebase } from '../lib/firebase';
import SettingsCard from '../components/settingCard';
import Navbar from '../components/navbar';
import Plan from '../modals/plan';


export default function Settings(props) {

    const { user } = useAuthListener()
    const [userInfo, setUserInfo] = useState(null);
    const [activeModal, setActiveModal] = useState(null)

    // Keep user info in sync
    useEffect(() => {

        const listener = firebase.firestore().collection('users').doc(user.uid)
            .onSnapshot(
                (snap) => {

                    setUserInfo({
                        storage_capacity: (snap.data().storage_capacity / 1000000000),
                        capacity_used: (snap.data().capacity_used / 1000000000).toFixed(3)
                    });

                }
            );

        return () => listener()

    }, [user.uid]);


    // Change modal
    const changeModal = (modal) => {
        setActiveModal(modal)
    }



    return (
        <div>
            <Navbar
                loggedIn
                to={ROUTES.LIBRARY}
            />
            {activeModal === 'plan' && <Plan
                onClick={changeModal}
                firebase={firebase}
                user={user}
            />}
            {userInfo ?
                <>
                    <div className={styles.container}>
                        <h2>Personal Info</h2>
                        <SettingsCard title={"Email"} info={user.email} />
                        <SettingsCard title={"Password"} info={"•••••••••"} />
                        <h2>Subscription</h2>
                        <SettingsCard title={"Plan"} info={"Free"} onClick={() => changeModal('plan')} />
                        <SettingsCard title={"Storage"} info={`${userInfo.capacity_used}GB / ${userInfo.storage_capacity}GB used`} />
                    </div>
                </>
                :
                null}

        </div>

    );
}