import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../media/logo-dark.svg"
import * as ROUTES from '../../constants/routes';
import styles from './styles.module.css';
import { FirebaseContext } from '../../context/firebase';
import { MdSettings } from 'react-icons/md';
import { HiOutlineLogout } from 'react-icons/hi';
import { BiBookHeart } from 'react-icons/bi';

import Dropdown from '../dropdown';
import ToggleMenu from '../toggleMenu';
import ButtonLight from '../buttonLight';
import ToggleNotifications from '../toggleNotifications';




export default function NavbarBottom(props) {

    const { firebase } = useContext(FirebaseContext);

    const logout = () => {
        firebase.auth().signOut()
    }

    return (
        <div className={styles.nav}>
            <div className={`${styles.container}`}>
                <div className={styles.menuContainer}>
                    <Link to={ROUTES.LIBRARY}>
                        <ButtonLight stacked title={'Library'} icon={<BiBookHeart />} />
                    </Link>
                    <Link to={ROUTES.SETTINGS}>
                        <ButtonLight stacked title={'Settings'} icon={<MdSettings />} />
                    </Link>
                    <ButtonLight stacked onClick={logout} title={'Logout'} icon={<HiOutlineLogout />} />
                </div>

            </div>
        </div>
    );
};