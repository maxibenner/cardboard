import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from "../../media/logo-dark.svg"
import ArrowText from "../arrow-text"
import * as ROUTES from '../../constants/routes';
import styles from './styles.module.css';




export default function Navbar(props) {

    if(props.variant === 'noMenu'){
        return (
            <div className={styles.nav}>
                <div className={styles.container}>
                    <Link to={props.to}>
                        <img className={styles.logo} to="/" src={Logo} />
                    </Link>
                </div>
            </div>
        );
    }else{
        return (
            <div className={styles.nav}>
                <div className={styles.container}>
                    <Link to={props.to}>
                        <img className={styles.logo} to="/" src={Logo} />
                    </Link>
                    {!props.noMenu && 
                    <Link to={ROUTES.SIGN_IN}>
                        <ArrowText text="Login" />
                    </Link>}
                </div>
            </div>
        );
    };
};