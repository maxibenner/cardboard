import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../media/logo-dark.svg"
import * as ROUTES from '../../constants/routes';
import styles from './styles.module.css';
import { FirebaseContext } from '../../context/firebase';
import { BiBookHeart } from 'react-icons/bi';
import { HiOutlineLogout } from 'react-icons/hi';
import { MdSettings, MdGroup } from 'react-icons/md';

import UserContext from '../userContext';
import ButtonLight from '../buttonLight';


export default function Navbar() {

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
                    <div className={styles.navMenuWide}>
                        <Link as={Link} to={ROUTES.LIBRARY}>
                            <ButtonLight title={'Library'} />
                        </Link>
                        <Link as={Link} to={'#'}>
                            <ButtonLight title={'Shared'} onClick={()=>window.alert('Coming soon.')} />
                        </Link>
                        <UserContext firebase={firebase}>
                            <Link as={Link} to={ROUTES.SETTINGS}>
                                <ButtonLight title={'Settings'} icon={<MdSettings />} />
                            </Link>
                            <ButtonLight title={'Logout'} onClick={logout} icon={<HiOutlineLogout />} />
                        </UserContext>
                    </div>
                    <div className={styles.navMenuNarrow}>
                        <UserContext firebase={firebase} text={'M'} routes={ROUTES} logout={logout} >
                            <Link as={Link} to={ROUTES.LIBRARY}>
                                <ButtonLight large title={'Library'} icon={<BiBookHeart />} />
                            </Link>
                            <Link as={Link} to={'#'}>
                                <ButtonLight large title={'Shared'} onClick={()=>window.alert('Coming soon.')} icon={<MdGroup />} />
                            </Link>
                            <Link as={Link} to={ROUTES.SETTINGS}>
                                <ButtonLight large title={'Settings'} icon={<MdSettings />} />
                            </Link>
                            <ButtonLight large title={'Logout'} onClick={logout} icon={<HiOutlineLogout />} />
                        </UserContext>
                    </div>
                </div>
            </div>
        </div>
    );
};