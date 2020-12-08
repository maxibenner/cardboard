import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../media/logo-dark.svg"
import ArrowText from "../arrow-text"
import * as ROUTES from '../../constants/routes';
import styles from './styles.module.css';
import { FirebaseContext } from '../../context/firebase';
import { MdSettings } from 'react-icons/md';




export default function NavbarLanding(props) {

    const { firebase } = useContext(FirebaseContext);

    const classes = `
        ${styles.nav}
        ${props.yellow && styles.nav_yellow}
    `

    const logout = () => {
        firebase.auth().signOut()
    }

    return (
        <div className={classes}>
            <div className={styles.container}>
                <Link to={props.to}>
                    <img className={styles.logo} to="/" src={Logo} alt='CardboardLogo' />
                </Link>
                {!props.noMenu &&
                    <div className={styles.menu}>
                        {props.loggedIn ?
                            <div className={styles.menuContainer}>
                                <p onClick={props.settingsOnClick} className={styles.link}><MdSettings style={{marginRight:'5px'}} />Settings</p>
                                <p className={styles.link} onClick={logout}>Logout</p>
                            </div>
                            :
                            <Link to={ROUTES.SIGN_IN}>
                                <ArrowText text="Login" />
                            </Link>
                        }
                    </div>
                }
            </div>
        </div>
    );
};