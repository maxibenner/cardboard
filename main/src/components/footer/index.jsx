import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import styles from './styles.module.css';



export default function Footer(props) {
    return (
        <div className={styles.container}>
            <div className={`${styles.row} ${props.light && styles.light}`}>
                <Link className={styles.link} to={ROUTES.LANDING}>
                    <p className={styles.text}>Privacy Policy</p>
                </Link>
                <Link className={styles.link} to={ROUTES.LANDING}>
                    <p className={styles.text}>Terms of Service</p>
                </Link>
                <Link className={styles.link} to={ROUTES.LANDING}>
                    <p className={styles.text}>Contact</p>
                </Link>
            </div>
        </div>
    );
};
