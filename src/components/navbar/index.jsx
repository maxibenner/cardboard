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


export default function Navbar(props) {

    const { firebase } = useContext(FirebaseContext);
    const [menuActive, setMenuActive] = useState(false)

    const logout = () => {
        firebase.auth().signOut()
    }

    return (
        <div className={styles.nav}>

            <div className={`${styles.container} ${menuActive && styles.topLayer}`}>

                <img className={styles.logo} to="/" src={Logo} alt='CardboardLogo' />

                <div className={styles.menuContainer}>

                    <ToggleNotifications />

                    <div className={styles.navMenuWide}>
                        <Link to={ROUTES.LIBRARY}>
                            <ButtonLight title={'Library'} icon={<BiBookHeart />} />
                        </Link>
                        <Link to={ROUTES.SETTINGS}>
                            <ButtonLight title={'Settings'} icon={<MdSettings />} />
                        </Link>
                        <ButtonLight onClick={logout} title={'Logout'} icon={<HiOutlineLogout />} />
                    </div>

                    <div className={styles.navMenuNarrow}>
                        <ToggleMenu active={menuActive} onClick={() => setMenuActive(prevMenuActive => !prevMenuActive)}>
                            {
                                menuActive && <div className={styles.menuBackground} />
                            }
                            <Dropdown active={menuActive}>
                                <Link to={ROUTES.LIBRARY}>
                                    <ButtonLight title={'Library'} icon={<BiBookHeart />} />
                                </Link>
                                <Link to={ROUTES.SETTINGS}>
                                    <ButtonLight title={'Settings'} icon={<MdSettings />} />
                                </Link>
                                <ButtonLight onClick={logout} title={'Logout'} icon={<HiOutlineLogout />} />
                            </Dropdown>
                        </ToggleMenu>
                    </div>

                </div>
            </div>
        </div>
    );
};