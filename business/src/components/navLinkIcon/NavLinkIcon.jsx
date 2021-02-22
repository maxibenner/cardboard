import React from "react";
import styles from "./styles.module.css";
import { NavLink } from "react-router-dom";

function NavLinkIcon({ to, icon, text, disabled, notification }) {
    return (
        <>
            {!disabled ? (
                <NavLink
                    to={to}
                    className={styles.container}
                    activeClassName={styles.active}
                    disabled
                >
                    <div className={styles.icon}>{icon}</div>
                    <div>
                        <p className={styles.text}>{text}</p>
                        {notification && (
                            <div className={styles.notification}>
                                {notification}
                            </div>
                        )}
                    </div>
                </NavLink>
            ) : (
                <div className={`${styles.container} ${styles.disabled}`}>
                    <div>{icon}</div>
                    <p>{text}</p>
                </div>
            )}
        </>
    );
}

export default NavLinkIcon;
